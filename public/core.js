export const emptyState = () => ({ version: 1, plans: [], selectedId: null, timer: null });

export function remaining(timer, now = Date.now()) {
  if (!timer) return 0;
  return Math.max(0, timer.endsAt === null ? timer.remainingMs : timer.endsAt - now);
}

export function validateState(value) {
  if (!value || value.version !== 1 || !Array.isArray(value.plans) || value.plans.length > 200) throw new Error('Kayıt biçimi geçersiz.');
  const ids = new Set();
  // Older saved plans allow six steps and longer text; keep those records readable.
  for (const plan of value.plans) {
    if (!plan || typeof plan.id !== 'string' || ids.has(plan.id) || typeof plan.task !== 'string' || plan.task.length > 500 || !Number.isInteger(plan.minutes) || plan.minutes < 5 || plan.minutes > 120 || typeof plan.createdAt !== 'string' || typeof plan.model !== 'string' || !Array.isArray(plan.steps) || plan.steps.length < 3 || plan.steps.length > 6) throw new Error('Plan kaydı geçersiz.');
    ids.add(plan.id);
    for (const step of plan.steps) {
      if (!step || typeof step.title !== 'string' || step.title.length > 140 || typeof step.detail !== 'string' || step.detail.length > 600 || !Number.isInteger(step.minutes) || step.minutes < 1 || typeof step.done !== 'boolean') throw new Error('Adım kaydı geçersiz.');
    }
    if (plan.steps.reduce((sum, step) => sum + step.minutes, 0) !== plan.minutes) throw new Error('Plan süreleri geçersiz.');
  }
  if (value.selectedId !== null && !ids.has(value.selectedId)) throw new Error('Seçili plan bulunamadı.');
  if (value.timer !== null) {
    const timer = value.timer;
    const plan = value.plans.find(item => item.id === timer.planId);
    if (!plan || !Number.isInteger(timer.stepIndex) || !plan.steps[timer.stepIndex] || !Number.isFinite(timer.remainingMs) || timer.remainingMs < 0 || timer.remainingMs > 7200000 || (timer.endsAt !== null && (!Number.isFinite(timer.endsAt) || timer.endsAt < 0))) throw new Error('Sayaç kaydı geçersiz.');
  }
  return value;
}
