import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import http from 'node:http';
import { validateInput, normalizePlan } from './plan.mjs';
import { validateState, emptyState, remaining } from './public/core.js';
import { createApp } from './server.mjs';

const sample = { steps: [
  { title: 'İlanın gereksinimlerini çıkar', detail: 'İlandaki üç temel beceriyi not et.', minutes: 3 },
  { title: 'İlgili projeni seç', detail: 'Bu becerileri gösteren bir projeyi belirle.', minutes: 8 },
  { title: 'CV özetini yaz', detail: 'Seçtiğin projeyi iki somut cümleyle anlat.', minutes: 9 }
] };

test('input rejects empty, oversized and invalid minute values', () => {
  assert.deepEqual(validateInput({ task: '  CV hazırla ', minutes: 25 }), { task: 'CV hazırla', minutes: 25 });
  for (const value of [null, {}, { task: '   ', minutes: 25 }, { task: 'x'.repeat(501), minutes: 25 }, { task: 'CV hazırla', minutes: 4 }, { task: 'CV hazırla', minutes: '25' }, { task: 'CV hazırla', minutes: 25.5 }, { task: 'CV hazırla', minutes: 121 }]) assert.throws(() => validateInput(value));
});

test('every supported budget preserves positive steps and exact total', () => {
  for (let budget = 5; budget <= 120; budget++) {
    const steps = normalizePlan(sample, budget);
    assert.equal(steps.reduce((sum, step) => sum + step.minutes, 0), budget);
    assert.ok(steps.every(step => Number.isInteger(step.minutes) && step.minutes >= 1 && step.done === false));
  }
});

test('model output is validated instead of silently fabricated', () => {
  for (const value of [null, {}, { steps: [] }, { steps: [...sample.steps, ...sample.steps, ...sample.steps] }, { steps: sample.steps.map(step => ({ ...step, minutes: -1 })) }, { steps: sample.steps.map(step => ({ ...step, title: '' })) }, { steps: sample.steps.map(step => ({ ...step, detail: null })) }]) assert.throws(() => normalizePlan(value, 25));
});

test('timer uses wall time, survives suspension and does not go negative', () => {
  assert.equal(remaining({ remainingMs: 60000, endsAt: 90000 }, 45000), 45000);
  assert.equal(remaining({ remainingMs: 60000, endsAt: 90000 }, 100000), 0);
  assert.equal(remaining({ remainingMs: 45000, endsAt: null }, 100000), 45000);
});

test('stored state is validated with timer references and budget invariants', () => {
  assert.deepEqual(validateState(emptyState()), emptyState());
  const plan = { id: 'one', task: 'CV hazırla', minutes: 25, model: 'llama3.2:latest', createdAt: new Date().toISOString(), steps: normalizePlan(sample, 25) };
  const state = { version: 1, plans: [plan], selectedId: 'one', timer: { planId: 'one', stepIndex: 0, remainingMs: 60000, endsAt: null } };
  assert.deepEqual(validateState(JSON.parse(JSON.stringify(state))), state);
  assert.throws(() => validateState({ ...state, selectedId: 'missing' }));
  assert.throws(() => validateState({ ...state, timer: { ...state.timer, stepIndex: 99 } }));
  assert.throws(() => validateState({ ...state, plans: [plan, plan] }));
  assert.throws(() => validateState({ ...state, plans: [{ ...plan, minutes: 30 }] }));
});

test('HTTP boundary, model contract, error recovery and allowed files', async t => {
  let mode = 'ok'; let calls = 0;
  const server = createApp({ fetchImpl: async (url, options) => {
    calls++;
    if (url.endsWith('/api/tags')) return { ok: true, json: async () => ({ models: [{ name: 'llama3.2:latest' }] }) };
    const body = JSON.parse(options.body);
    assert.equal(body.model, 'llama3.2:latest'); assert.equal(body.stream, false);
    assert.equal(body.format.type, 'object'); assert.equal(JSON.parse(body.messages.at(-1).content).availableMinutes, 25);
    if (mode === 'down') throw new TypeError('offline');
    return { ok: true, json: async () => ({ message: { content: mode === 'bad' ? 'not JSON' : JSON.stringify(sample) } }) };
  } });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  t.after(() => new Promise(resolve => { server.closeAllConnections(); server.close(resolve); }));
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (body, headers = {}) => fetch(base + '/api/plan', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
  assert.equal((await fetch(base)).status, 200);
  assert.equal((await fetch(base + '/.env')).status, 404);
  assert.equal((await fetch(base + '/server.mjs')).status, 404);
  assert.equal((await post({ task: 'CV hazırla', minutes: 25 }, { Origin: 'https://evil.example' })).status, 403);
  const invalidHostStatus = await new Promise((resolve, reject) => {
    const request = http.get(base, { headers: { Host: 'evil.example' } }, response => { response.resume(); resolve(response.statusCode); });
    request.on('error', reject);
  });
  assert.equal(invalidHostStatus, 403);
  assert.equal((await post({ task: 'x', minutes: 25 })).status, 400);
  assert.equal(calls, 0);
  assert.equal((await (await fetch(base + '/api/status')).json()).ready, true);
  const response = await post({ task: 'CV hazırla', minutes: 25 });
  assert.equal(response.status, 200);
  const data = await response.json(); assert.equal(data.steps.reduce((sum, step) => sum + step.minutes, 0), 25);
  mode = 'bad'; assert.equal((await post({ task: 'CV hazırla', minutes: 25 })).status, 502);
  mode = 'down'; assert.equal((await post({ task: 'CV hazırla', minutes: 25 })).status, 502);
  mode = 'ok'; assert.equal((await post({ task: 'CV hazırla', minutes: 25 })).status, 200);
});
