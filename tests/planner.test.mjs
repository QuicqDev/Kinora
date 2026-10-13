import test from 'node:test';
import assert from 'node:assert/strict';
import { makePlan, describeChange, InputError } from '../src/planner.mjs';
const brief = { name: 'Test Café', seats: 24, staff: 2, budget: 4500, kitchen: false, theme: 'slow-stories' };
test('repair preserves theme and respects a one-person staffing limit', () => {
  const first = makePlan(brief); const next = makePlan({ ...brief, staff: 1 });
  assert.equal(next.status, 'proposal'); assert.equal(next.format.minStaff, 1);
  assert.equal(next.theme.id, first.theme.id); assert.ok(next.guests <= brief.seats);
  assert.ok(next.cost <= brief.budget); assert.ok(describeChange(first, next).some(c => c.includes('Format:')));
});
test('insufficient staff and budget cannot produce false-ready plans', () => {
  assert.equal(makePlan({ ...brief, staff: 0 }).status, 'blocked');
  assert.equal(makePlan({ ...brief, budget: 579 }).status, 'blocked');
  const minimum = makePlan({ ...brief, budget: 580 });
  assert.equal(minimum.guests, 2); assert.equal(minimum.cost, 580);
});
test('constraints hold across combinations including budget and capacity boundaries', () => {
  for (const staff of [0, 1, 2, 10]) for (const seats of [2, 7, 12, 24, 100]) for (const budget of [0, 580, 1230, 1800, 4500]) {
    const p = makePlan({ ...brief, staff, seats, budget });
    if (p.status === 'proposal') { assert.ok(p.cost <= budget); assert.ok(p.format.minStaff <= staff); assert.ok(p.guests <= seats); assert.ok(p.guests >= 2); }
  }
});
test('reject malformed constraints instead of silently coercing values', () => {
  for (const input of [null, [], { ...brief, seats: -1 }, { ...brief, budget: NaN }, { ...brief, staff: '2' }, { ...brief, kitchen: 'false' }, { ...brief, theme: 'invented' }]) assert.throws(() => makePlan(input), InputError);
});
test('invitation is explicitly a draft with no invented date or attendance', () => {
  const p = makePlan(brief); assert.match(p.invitation, /to be confirmed/); assert.match(p.invitation, /Draft invitation/); assert.equal(p.mode, 'sample');
});
