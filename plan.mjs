export function validateInput(input) {
  if (!input || typeof input.task !== 'string' || input.task.trim().length < 5 || input.task.trim().length > 500) {
    throw new Error('Görevini 5–500 karakter arasında yaz.');
  }
  if (!Number.isInteger(input.minutes) || input.minutes < 5 || input.minutes > 120) {
    throw new Error('5 ile 120 dakika arasında bir süre seç.');
  }
  return { task: input.task.trim(), minutes: input.minutes };
}

export const planSchema = {
  type: 'object', additionalProperties: false,
  properties: {
    steps: { type: 'array', minItems: 3, maxItems: 5, items: {
      type: 'object', additionalProperties: false,
      properties: { title: { type: 'string', minLength: 3, maxLength: 90 }, detail: { type: 'string', minLength: 5, maxLength: 240 }, minutes: { type: 'integer', minimum: 1, maximum: 120 } },
      required: ['title', 'detail', 'minutes']
    } }
  }, required: ['steps']
};

export function normalizePlan(value, budget) {
  if (!Number.isInteger(budget) || budget < 5 || budget > 120 || !value || !Array.isArray(value.steps) || value.steps.length < 3 || value.steps.length > Math.min(6, budget)) {
    throw new Error('Model kullanılabilir bir plan üretmedi. Lütfen yeniden dene.');
  }
  const steps = value.steps.map(step => {
    if (!step || typeof step.title !== 'string' || !step.title.trim() || step.title.length > 140 || typeof step.detail !== 'string' || !step.detail.trim() || step.detail.length > 600 || !Number.isInteger(step.minutes) || step.minutes < 1 || step.minutes > 120) {
      throw new Error('Modelin adımları doğrulanamadı. Lütfen yeniden dene.');
    }
    return { title: step.title.trim(), detail: step.detail.trim(), minutes: step.minutes, done: false };
  });
  // Reserve one minute per step, then distribute the remaining budget by model weights.
  const available = budget - steps.length;
  const sum = steps.reduce((total, step) => total + step.minutes, 0);
  const shares = steps.map(step => available * step.minutes / sum);
  const allocated = shares.map(share => 1 + Math.floor(share));
  let remainder = budget - allocated.reduce((a, b) => a + b, 0);
  const order = shares.map((share, i) => ({ i, fraction: share - Math.floor(share) })).sort((a, b) => b.fraction - a.fraction);
  for (const item of order) { if (remainder-- <= 0) break; allocated[item.i]++; }
  return steps.map((step, i) => ({ ...step, minutes: allocated[i] }));
}
