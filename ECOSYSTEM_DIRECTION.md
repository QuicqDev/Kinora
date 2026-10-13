# Tuesday Fix — from planner to recurring local gatherings

**Subsequent technical-depth review:** this ecosystem proposal is not the default expansion plan until its core mechanism is validated. See COMPETITOR_SOURCE_AUDIT.md and MECHANISM_PROOF_PLAN.md. Marketplace scope and reliable coordination alone do not establish originality or meaningful Qloo contribution.

Working product proposal, October 3, 2026. User says the planner feels like a gimmick, asks how to add/get a new restaurant, and wants an ecosystem. This document proposes a scope; the existing app remains a sample planner. No partners, customers, demand or bookings have been obtained.

Research provenance: Codex verified the primary sources below and owns this recommendation. A read-only Claude follow-up was attempted on the existing topic/session; the helper exited with status 1 before a response/model verification. No new Claude contribution or model consensus is claimed. The earlier successful session remains unchanged.

## Product promise

Help a local venue and a community host find each other, agree on an event they can actually run, and decide whether to run it again.

Tuesday Fix becomes the venue-facing entry point. The connected product has venues, hosts/communities and guests. Local suppliers/shops can join later as event partners. Each joins for a concrete exchange, rather than to populate a generic social feed.

| Participant | Brings | Receives | Reason to return |
|---|---|---|---|
| Café / restaurant | Explicitly offered slot, capacity, facilities, terms | A feasible host/event proposal | Recurring bookings and an operating history |
| Club / workshop host | Activity, requirements, availability; optionally an existing audience | Suitable venues and a reusable running plan | Repeat sessions with less coordination |
| Guest | Explicit interests, RSVP and optional feedback | Relevant gatherings and clear attendance details | A recurring community |
| Later: local shop / supplier | Relevant products, equipment or expertise | Approved collaborations | Repeat partnerships |

Benefits above are hypotheses, not measured outcomes.

## Adding a restaurant

Current app: editing the café name only changes draft text. It does not search, save a venue, verify ownership or retrieve Qloo data.

Proposed onboarding: search by name and city, confirm the exact place/address, or add a venue manually. Save an application-owned venue ID independently from an optional Qloo entity ID. The operator supplies slots, capacity, usable space, staff, kitchen/noise restrictions, budget and terms. Public listing data cannot establish permission or actual availability.

For a newly opened or missing venue, allow normal onboarding. Ask the operator for explicit cultural anchors and intended experience; optionally collect guest interests with consent. Use supported Qloo entities/tags as taste inputs if available. Label these as owner-selected inputs, not knowledge of the venue's real customers. Never silently substitute another venue or invent a Qloo record. A no-match response is a real product state.

[Qloo Search](https://github.com/qloo/docs-public/blob/main/reference/get-search.md) documents name/category and geographic filters. [Qloo capabilities](https://www.qloo.com/capabilities) describe recommendations from combinations of interests and location. Actual issued-key coverage remains untested.

## One complete loop

1. Venue offers a quiet slot with hard operational limits.
2. Host proposes a session or is shortlisted from participating, available hosts.
3. Qloo-supported cultural signals help rank relevant themes; application rules enforce distance, time, capacity, facilities and total stated costs. Qloo does not supply host availability or predict attendance.
4. Venue and host review responsibilities, price and terms; approval creates a confirmed event. A recommendation never creates a booking.
5. Guests RSVP to that event; distinguish interested, registered and checked-in counts.
6. Owner/host records actual turnout, itemized event costs, optional receipts and feedback. A follow-up proposes repeat, revise or stop. One event does not establish causal revenue uplift.

## Competitive boundary

An ecosystem is not an originality claim. [Peerspace](https://hosts.peerspace.com/for-events) explicitly markets off-peak event use for cafés and provides booking tools. [Meetup](https://help.meetup.com/hc/en-us/articles/42913436322189-Affiliations-partnerships-and-business-promotion-on-Meetup) supports community/venue partnerships. [Partiful](https://help.partiful.com/en-us/articles/15525568-what-is-the-partiful-explore-page) already offers local event discovery. Earlier research also found event-planning tools Doreniva and Veeso.

The proposed distinction is culturally grounded formation and repair of recurring venue/host programs. This remains unproved and must beat an equally informed direct search/LLM workflow. Matching existing interest labels alone may make Qloo unnecessary.

## Cold start and scope

Start in one neighborhood with one repeatable category, such as small creative workshops or reading groups. Work with existing organizers before trying to recruit a new consumer audience. A proposed pilot is three consenting venues and three hosts; those people are not currently available or recruited. Public listings are research leads, not enrolled participants. Outreach requires an explicit user request.

For a demonstrable build, use clearly marked fixtures where real partners are absent. Build one shared event record across venue view, host view and guest RSVP view. Do not manufacture a busy marketplace, reviews, attendance or measured results. Payments, supplier marketplace, POS integrations, delivery, generic CRM and loyalty currency are outside the first release.

Expand after the loop works: recurring series; alternative venue/host matching when a session becomes infeasible; bookstore/artist/food collaborations; guest discovery and repeat attendance across participating venues. Scope remains local gatherings.

## Candidate comparison

| Direction | Strength | Fatal assumption | Decision |
|---|---|---|---|
| Owner experimentation tool | Works for one café without a network; records test results | Owner has time and audience to organize events, and Qloo adds useful direction | Fallback / first-party utility |
| Venue–host recurring programs | Removes hosting burden; each side exchanges something concrete | Willing, available local hosts and venues exist; taste-informed matching adds value beyond basic constraints | Provisional ecosystem direction |

For judging, the second has a clearer exchange and stronger whole-product story, but the first wins if no real host partnership can be demonstrated. No numeric score pretends to measure demand.

## Next evidence and implementation gates

Next independent engineering unit: durable venue profiles, missing-Qloo onboarding, available slots and host requirements. Then proposal approval, RSVP and outcome records. Authentication/ownership and real data protection are needed before a live multi-user pilot.

Within a bounded 48-hour validation sprint, once key access and willing participants exist: exercise known/missing/ambiguous venue cases; compare five feasible venue-host situations under Qloo vs an equally informed LLM/manual baseline; ask both sides to independently assess runnability and concrete usefulness before revealing the source. Planning threshold: at least three of five joint preferences with specific useful differences earns further testing, not a significance or market-fit claim. Any invented availability/confirmation fails the demo. If Qloo cannot change a useful decision, downgrade the sponsor claim and revisit the mechanism. If partners will not consider running any session, do not build a marketplace around them.

Success is a mutually accepted feasible event and eventual repeat willingness, not poster count or generated ideas. Observed turnout and repeat attendance require actual events, not a 48-hour simulation.
