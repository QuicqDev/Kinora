import { themes, describeChange } from '/planner.mjs';
let selected = themes[0].id;
let current = null;
let busy = false;
const $ = id => document.getElementById(id);
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const rupees = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
const treatments = {
  'slow-stories': { short: 'Reading room', caption: 'Bring a book. Leave with a recommendation.', title: 'Slow stories.<br>Warm cups.', class: '' },
  'paper-worlds': { short: 'Postcard studio', caption: 'A table, a blank page, a little imagination.', title: 'Little worlds<br>on paper.', class: 'paper' },
  'local-lens': { short: 'Photo exchange', caption: 'Your neighborhood. A different point of view.', title: 'Through<br>a local<br>lens.', class: 'lens' }
};
function renderThemes() {
  $('theme-options').innerHTML = themes.map((t, i) => `<button class="theme-choice ${selected === t.id ? 'selected' : ''}" data-theme="${t.id}" aria-pressed="${selected === t.id}" ${busy ? 'disabled' : ''}><span class="choice-number">0${i + 1}</span><span><strong>${treatments[t.id].short}</strong><small>${esc(t.label)}</small></span></button>`).join('');
  document.querySelectorAll('[data-theme]').forEach(button => button.addEventListener('click', () => {
    if (busy) return;
    selected = button.dataset.theme; renderThemes();
    if (current) generate();
  }));
}
function readBrief() { return { name: $('name').value, seats: Number($('seats').value), staff: Number($('staff').value), budget: Number($('budget').value), kitchen: $('kitchen').checked, theme: selected }; }
async function generate() {
  if (busy || !$('brief-form').reportValidity()) return;
  busy = true; $('plan-button').disabled = true; $('result').setAttribute('aria-busy', 'true'); $('form-error').textContent = ''; renderThemes();
  try {
    const response = await fetch('/api/plan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(readBrief()) });
    const plan = await response.json();
    if (!response.ok) throw new Error(plan.error || 'Please try again.');
    const changes = describeChange(current, plan); current = plan; renderPlan(plan, changes);
  } catch (error) { $('form-error').textContent = error.message; }
  finally { busy = false; $('plan-button').disabled = false; $('result').setAttribute('aria-busy', 'false'); renderThemes(); }
}
function renderPlan(plan, changes) {
  if (plan.status === 'blocked') { $('result').innerHTML = `<div class="blocked"><span class="eyebrow">THE BRIEF NEEDS AN ADJUSTMENT</span><h3>This one doesn’t fit yet.</h3><p>${esc(plan.reason)}</p></div>`; return; }
  const design = treatments[plan.theme.id];
  $('result').innerHTML = `<article class="plan">
    <div class="event-board"><section class="event-poster ${design.class}" aria-label="Draft event poster"><div class="poster-top"><span>TUESDAY / AFTER HOURS</span><span>DRAFT 01</span></div><h2 class="poster-title">${design.title}</h2><p class="poster-caption">${design.caption}</p><div class="poster-bottom"><span>${esc(plan.brief.name)}<br>${plan.guests} SEATS · ${plan.format.duration} MIN</span><span>DATE & TIME<br>TO CONFIRM</span></div></section>
    <section class="plan-receipt"><div class="receipt-heading"><span>03 / THE PLAN</span><span>SAMPLE</span></div><h2>${esc(plan.format.name)}</h2><p class="plan-description">${esc(plan.theme.description)}</p><div class="receipt-line"><span>Guest limit</span><b>${plan.guests} people</b></div><div class="receipt-line"><span>Staff needed</span><b>${plan.format.minStaff} of ${plan.brief.staff} available</b></div><div class="receipt-line"><span>Duration</span><b>${plan.format.duration} minutes</b></div><div class="receipt-line total"><span>Materials & setup</span><b>${rupees(plan.cost)}</b></div><p class="receipt-note">${rupees(plan.remaining)} left from your ${rupees(plan.brief.budget)} budget.<br>Sample estimate; excludes wages, tax & refreshments.</p><p class="receipt-note">${esc(plan.service)}</p></section></div>
    ${changes.length ? `<div class="change-note"><strong>Here’s what changed.</strong><ul>${changes.map(c => `<li>${esc(c)}</li>`).join('')}</ul></div>` : ''}
    <div class="repair"><span>A change of plans?</span><button id="one-staff" ${plan.brief.staff <= 1 ? 'disabled' : ''}>I only have one staff member</button><button id="lower-budget" ${plan.brief.budget < 1000 ? 'disabled' : ''}>Halve the budget</button></div>
    <div class="plan-columns"><section><h3>The running order</h3><ol class="timeline">${plan.timeline.map(step => `<li><span>${step.at}</span><div><strong>${esc(step.title)}</strong><p>${esc(step.detail)}</p></div></li>`).join('')}</ol></section><section class="invitation"><h3>Invite the neighborhood.</h3><p>${esc(plan.theme.name)}\nAt ${esc(plan.brief.name)}</p><p>${esc(plan.timeline[1].detail)}. Stay for the conversation.</p><small>Draft only. Add the date, time, admission and booking link before sharing.</small><button id="download" class="secondary">Download invitation draft ↓</button></section></div>
    <details><summary>Sources & planning assumptions</summary><p>These themes are editorial samples. Qloo is not connected yet. Costs use ${rupees(plan.format.fixedCost)} setup + ${rupees(plan.format.perGuest)} per guest. Replace these assumptions with supplier quotes.</p><ul>${plan.checks.map(c => `<li>${esc(c)}</li>`).join('')}</ul><p>No screening, copyrighted image reproduction or music playback is included.</p></details></article>`;
  $('one-staff').addEventListener('click', () => { if (busy) return; $('staff').value = '1'; generate(); });
  $('lower-budget').addEventListener('click', () => { if (busy) return; $('budget').value = String(Math.floor(plan.brief.budget / 2)); generate(); });
  $('download').addEventListener('click', () => { const url = URL.createObjectURL(new Blob([plan.invitation], { type: 'text/plain;charset=utf-8' })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'tuesday-fix-invitation-draft.txt'; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); });
}
$('brief-form').addEventListener('submit', event => { event.preventDefault(); generate(); });
renderThemes();
