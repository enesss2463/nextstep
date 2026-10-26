import { emptyState, validateState, remaining } from './core.js';
const $ = id => document.getElementById(id);
const KEY = 'nextstep.v1';
let state = emptyState();
let canSave = true;
let busy = false;

function storageWarning(message) { $('storage-message').textContent = message; $('storage-message').hidden = false; }
try {
  const raw = localStorage.getItem(KEY);
  if (raw) state = validateState(JSON.parse(raw));
} catch {
  canSave = false;
  storageWarning('Önceki kayıt okunamadı veya tarayıcı kayıt alanı kapalı. Eski verinin üzerine yazılmayacak; bu oturumdaki değişiklikler kalıcı olmayacak.');
}

function save() {
  if (canSave) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch { canSave = false; storageWarning('Tarayıcıya kayıt yapılamadı. Bu oturumdaki ilerlemen açık sayfada kalır; sayfayı kapatırsan kaybolabilir.'); }
  }
  $('save-indicator').textContent = canSave ? 'Kaydedildi' : 'Kaydedilemedi';
}
const selectedPlan = () => state.plans.find(plan => plan.id === state.selectedId);

function pauseTimer() {
  if (!state.timer) return;
  state.timer.remainingMs = remaining(state.timer);
  state.timer.endsAt = null;
}

function selectStep(index) {
  const plan = selectedPlan();
  if (!plan || plan.steps[index]?.done) return;
  if (state.timer?.planId !== plan.id || state.timer.stepIndex !== index) {
    state.timer = { planId: plan.id, stepIndex: index, remainingMs: plan.steps[index].minutes * 60000, endsAt: null };
  }
  save(); render();
}

function ensureTimer() {
  const plan = selectedPlan();
  if (!plan) { state.timer = null; return; }
  const first = plan.steps.findIndex(step => !step.done);
  if (first < 0) { state.timer = null; return; }
  if (state.timer?.planId !== plan.id || plan.steps[state.timer.stepIndex]?.done) {
    state.timer = { planId: plan.id, stepIndex: first, remainingMs: plan.steps[first].minutes * 60000, endsAt: null };
  }
}

function renderHistory() {
  $('plan-count').textContent = String(state.plans.length);
  $('history-empty').hidden = state.plans.length > 0;
  $('history-list').replaceChildren();
  for (const plan of [...state.plans].reverse()) {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'history-item' + (plan.id === state.selectedId ? ' current' : '');
    button.id = `plan-${plan.id}`;
    button.setAttribute('aria-pressed', String(plan.id === state.selectedId));
    const icon = document.createElement('span'); icon.textContent = plan.steps.every(step => step.done) ? '✓' : 'ϟ'; icon.setAttribute('aria-hidden', 'true');
    const info = document.createElement('div');
    const title = document.createElement('strong'); title.textContent = plan.task;
    const meta = document.createElement('small'); meta.textContent = `${plan.minutes} dk · ${plan.steps.filter(step => step.done).length}/${plan.steps.length} adım tamamlandı`;
    info.append(title, meta); button.append(icon, info);
    button.addEventListener('click', () => {
      if (busy || plan.id === state.selectedId) return;
      pauseTimer(); state.selectedId = plan.id; ensureTimer(); save(); render();
    });
    button.disabled = busy; $('history-list').append(button);
  }
}

function render() {
  const focusedId = document.activeElement.id;
  const plan = selectedPlan();
  $('empty-plan').hidden = Boolean(plan);
  $('active-plan').hidden = !plan;
  renderHistory();
  if (!plan) return;
  const done = plan.steps.filter(step => step.done).length;
  $('plan-title').textContent = plan.task;
  $('plan-meta').textContent = `${plan.minutes} DAKİKA · ${plan.steps.length} ADIM`;
  $('progress-text').textContent = `${done}/${plan.steps.length} adım · %${Math.round(done / plan.steps.length * 100)}`;
  $('progress').value = done / plan.steps.length * 100;
  $('steps').replaceChildren();
  plan.steps.forEach((step, index) => {
    const node = $('step-template').content.firstElementChild.cloneNode(true);
    node.classList.toggle('done', step.done);
    node.classList.toggle('active', state.timer?.planId === plan.id && state.timer.stepIndex === index);
    node.querySelector('h4').textContent = step.title;
    node.querySelector('p').textContent = step.detail;
    node.querySelector('.step-time').textContent = `◷ ${step.minutes} dakika`;
    const check = node.querySelector('.check');
    check.id = `step-check-${index}`;
    check.textContent = step.done ? '✓' : String(index + 1).padStart(2, '0');
    check.setAttribute('aria-label', `${index + 1}. adımı ${step.done ? 'geri al' : 'tamamla'}: ${step.title}`);
    check.setAttribute('aria-pressed', String(step.done));
    check.addEventListener('click', () => { step.done = !step.done; ensureTimer(); save(); render(); });
    const focus = node.querySelector('.focus-step');
    focus.id = `step-focus-${index}`;
    focus.hidden = step.done;
    focus.textContent = state.timer?.planId === plan.id && state.timer.stepIndex === index ? 'Seçili adım' : 'Odaklan ↗';
    focus.setAttribute('aria-label', `${index + 1}. adıma odaklan: ${step.title}`);
    focus.addEventListener('click', () => selectStep(index));
    $('steps').append(node);
  });
  $('complete').hidden = done !== plan.steps.length;
  $('focus').hidden = done === plan.steps.length;
  if (state.timer && done !== plan.steps.length) $('focus-title').textContent = plan.steps[state.timer.stepIndex].title;
  $('save-indicator').textContent = canSave ? 'Kaydedildi' : 'Kaydedilemedi';
  tick();
  if (focusedId) $(focusedId)?.focus({ preventScroll: true });
}

function tick() {
  const timer = state.timer;
  if (!timer) return;
  const left = remaining(timer);
  if (timer.endsAt !== null && left === 0) {
    timer.remainingMs = 0; timer.endsAt = null; save();
  }
  const seconds = Math.ceil(left / 1000);
  $('timer').textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  $('timer-toggle').textContent = timer.endsAt !== null ? 'Duraklat' : left === 0 ? 'Yeniden başlat' : 'Başlat';
  $('focus-note').textContent = left === 0 ? 'Süre doldu.' : timer.endsAt !== null ? 'Çalışıyor' : '';
}

$('timer-toggle').addEventListener('click', () => {
  if (!state.timer) return;
  if (state.timer.endsAt !== null) pauseTimer();
  else {
    if (remaining(state.timer) === 0) state.timer.remainingMs = selectedPlan().steps[state.timer.stepIndex].minutes * 60000;
    state.timer.endsAt = Date.now() + state.timer.remainingMs;
  }
  save(); tick();
});
$('timer-reset').addEventListener('click', () => {
  if (!state.timer) return;
  state.timer.endsAt = null;
  state.timer.remainingMs = selectedPlan().steps[state.timer.stepIndex].minutes * 60000;
  save(); tick();
});

function updateMinutes() {
  $('minute-output').textContent = $('minutes').value;
  document.querySelectorAll('[data-minutes]').forEach(button => {
    const active = button.dataset.minutes === $('minutes').value;
    button.classList.toggle('selected', active); button.setAttribute('aria-pressed', String(active));
  });
}
$('minutes').addEventListener('input', updateMinutes);
document.querySelectorAll('[data-minutes]').forEach(button => button.addEventListener('click', () => { $('minutes').value = button.dataset.minutes; updateMinutes(); }));
$('task').addEventListener('input', () => { $('char-count').textContent = `${$('task').value.length} / 500`; });
document.querySelectorAll('[data-example]').forEach(button => button.addEventListener('click', () => {
  if (busy) return;
  $('task').value = button.dataset.example; $('task').dispatchEvent(new Event('input')); $('task').focus();
}));

async function checkStatus() {
  $('retry-status').disabled = true;
  try {
    const response = await fetch('/api/status');
    if (!response.ok) throw new Error();
    const status = await response.json();
    $('connection-status').hidden = status.ready;
    $('connection').textContent = status.ready ? '' : 'Bağlantı yok';
    $('connection').title = status.message;
    if (!status.ready) { $('form-error').textContent = status.message; $('form-error').hidden = false; }
  } catch {
    $('connection-status').hidden = false; $('connection').textContent = 'Bağlantı yok';
  } finally { $('retry-status').disabled = false; }
}
$('retry-status').addEventListener('click', () => { $('form-error').hidden = true; checkStatus(); });

$('plan-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (busy) return;
  const task = $('task').value.trim();
  if (task.length < 5) { $('form-error').textContent = 'Görevini en az 5 karakterle anlat.'; $('form-error').hidden = false; return; }
  if (state.plans.length >= 200) { $('form-error').textContent = 'Bu sürüm en fazla 200 plan saklar. Yeni bir tarayıcı profili kullanabilirsin; mevcut kayıtların korunuyor.'; $('form-error').hidden = false; return; }
  busy = true;
  $('generate').disabled = true; $('task').disabled = true; $('minutes').disabled = true;
  document.querySelectorAll('[data-example],[data-minutes]').forEach(button => button.disabled = true);
  $('generate-label').textContent = 'Hazırlanıyor'; $('form-error').hidden = true;
  $('generation-message').textContent = 'Plan hazırlanıyor…'; $('generation-message').hidden = false;
  $('plan-form').setAttribute('aria-busy', 'true'); renderHistory();
  try {
    const response = await fetch('/api/plan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ task, minutes: Number($('minutes').value) }), signal: AbortSignal.timeout(130000) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Plan oluşturulamadı.');
    const plan = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    const candidate = { ...state, plans: [...state.plans, plan], selectedId: plan.id, timer: null };
    validateState(candidate);
    state = candidate; ensureTimer(); save(); render();
    $('generation-message').hidden = true;
    $('plan-title').setAttribute('tabindex', '-1'); $('plan-title').focus({ preventScroll: true });
    if (window.innerWidth < 761) $('active-plan').scrollIntoView({ behavior: 'auto', block: 'start' });
  } catch (error) {
    $('form-error').textContent = error.name === 'TimeoutError' ? 'İstek zaman aşımına uğradı. Ollama’yı kontrol edip yeniden dene.' : error instanceof TypeError ? 'Sunucu bağlantısı kesildi. Uygulamanın çalıştığını kontrol et.' : error.message;
    $('form-error').hidden = false; $('generation-message').hidden = true;
  } finally {
    busy = false;
    $('generate').disabled = false; $('task').disabled = false; $('minutes').disabled = false;
    document.querySelectorAll('[data-example],[data-minutes]').forEach(button => button.disabled = false);
    $('generate-label').textContent = 'Plan oluştur'; $('plan-form').setAttribute('aria-busy', 'false'); renderHistory();
  }
});

// Keep one tab as the writer; silently merging two simultaneous focus sessions loses progress.
window.addEventListener('storage', event => {
  if (event.key === KEY) { canSave = false; storageWarning('Planların başka bir sekmede değişti. Üzerine yazmamak için bu sekmede kayıt durduruldu. Devam etmek için sayfayı yenile.'); }
});
ensureTimer(); render(); updateMinutes(); checkStatus();
setInterval(tick, 250);
