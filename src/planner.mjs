// Editorial fixtures, not Qloo responses. All costs are editable planning assumptions.
export const themes = [
  { id: 'slow-stories', name: 'Slow stories, warm cups', label: 'Literature & conversation', title: 'A little reading, a lot of conversation.', description: 'An evening for people who arrive with a book and leave with a new recommendation.', color: 'green' },
  { id: 'paper-worlds', name: 'Little worlds on paper', label: 'Illustration & imagination', title: 'Turn a coffee table into a tiny art studio.', description: 'Original postcards, playful prompts and a room of people making something with their hands.', color: 'orange' },
  { id: 'local-lens', name: 'Through a local lens', label: 'Photography & neighborhood', title: 'See your neighborhood through someone else’s eyes.', description: 'A small gathering to share your own photographs and the stories behind familiar streets.', color: 'blue' }
];

const formats = [
  { id: 'hosted', name: 'Hosted creative salon', minStaff: 2, fixedCost: 1500, perGuest: 110, duration: 90, maxSeats: 20, facilitator: true },
  { id: 'table', name: 'Self-guided table circle', minStaff: 1, fixedCost: 450, perGuest: 65, duration: 75, maxSeats: 12, facilitator: false }
];

export class InputError extends Error {}
export function validateBrief(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new InputError('Enter a café brief.');
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  if (!name || name.length > 100) throw new InputError('Use a café name between 1 and 100 characters.');
  for (const [key, low, high] of [['budget', 0, 1000000], ['seats', 2, 100], ['staff', 0, 10]]) {
    if (typeof input[key] !== 'number' || !Number.isInteger(input[key]) || input[key] < low || input[key] > high) throw new InputError(`Enter a whole-number ${key} between ${low} and ${high}.`);
  }
  if (!themes.some(t => t.id === input.theme)) throw new InputError('Choose an available inspiration.');
  if (typeof input.kitchen !== 'boolean') throw new InputError('Confirm whether the kitchen is available.');
  return { name, budget: input.budget, seats: input.seats, staff: input.staff, kitchen: input.kitchen, theme: input.theme };
}

export function makePlan(raw) {
  const brief = validateBrief(raw);
  const theme = themes.find(t => t.id === brief.theme);
  const options = formats.filter(f => brief.staff >= f.minStaff).map(format => {
    const affordableSeats = Math.floor((brief.budget - format.fixedCost) / format.perGuest);
    const guests = Math.min(brief.seats, format.maxSeats, affordableSeats);
    return { format, guests, cost: format.fixedCost + Math.max(guests, 0) * format.perGuest };
  }).filter(o => o.guests >= 2);
  if (!options.length) return { status: 'blocked', mode: 'sample', brief, reason: brief.staff === 0 ? 'Every format needs at least one available staff member. Add staff or choose another evening.' : 'The lowest-cost format needs ₹580 for two guests under these sample assumptions. Adjust the budget or revise the costs before planning.', options: [] };
  const { format, guests, cost } = options[0];
  const activities = {
    'slow-stories': ['Bring a book you love', 'Quiet reading, then paired recommendations', 'Leave a handwritten recommendation for the next guest'],
    'paper-worlds': ['Pick an original drawing prompt', 'Make a postcard inspired by an everyday moment', 'Share your postcard, or take it home'],
    'local-lens': ['Bring one photograph you took yourself', 'Share the story behind it in small groups', 'Write down a new place to notice on your next walk']
  }[theme.id];
  const invitation = `${theme.name}\nAt ${brief.name}\n\nJoin us for ${format.duration} minutes of ${theme.label.toLowerCase()}. ${activities[0]}.\n\nSmall gathering: up to ${guests} guests.\nDate, time, admission and booking link: to be confirmed.\n\nDraft invitation — confirm details before sharing.`;
  return {
    status: 'proposal', mode: 'sample', brief, theme, format, guests, cost,
    remaining: brief.budget - cost,
    service: brief.kitchen ? 'Optional existing-menu service; ingredients and service costs are not included.' : 'No kitchen service. Any drinks are separate from this event budget.',
    timeline: [
      { at: 'Before', title: 'Set the tables', detail: `Prepare materials for ${guests} guests. ${format.facilitator ? 'Assign one of the available staff to facilitate.' : 'Place a self-guided prompt card at each table.'}` },
      { at: '00:00', title: 'Make yourself at home', detail: activities[0] },
      { at: '00:15', title: 'The good part', detail: activities[1] },
      { at: format.duration === 90 ? '01:15' : '01:00', title: 'Something to take away', detail: activities[2] }
    ],
    checks: ['Confirm the date, time, staffing and permission to host.', 'Replace sample material costs with supplier quotes; existing staff wages, tax and refreshments are excluded.', 'Confirm guest interest before buying supplies. No attendance is predicted.'],
    invitation
  };
}

export function describeChange(previous, next) {
  if (!previous || previous.status !== 'proposal' || next.status !== 'proposal') return [];
  const changes = [];
  if (previous.format.id !== next.format.id) changes.push(`Format: ${previous.format.name} → ${next.format.name}.`);
  if (previous.guests !== next.guests) changes.push(`Guest capacity: ${previous.guests} → ${next.guests}.`);
  if (previous.cost !== next.cost) changes.push(`Estimated materials and setup: ₹${previous.cost} → ₹${next.cost}.`);
  if (previous.service !== next.service) changes.push(next.service);
  if (previous.theme.id === next.theme.id && changes.length) changes.push('Your chosen cultural theme stays in place.');
  return changes;
}
