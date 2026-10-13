# Tuesday Fix — resources and build requirements

Updated October 3, 2026. Implementation is user-authorized. User needs Qloo access and reports LLM access; exact provider and API entitlement are pending clarification. No spending or publishing has occurred.

## Competition resources

| Resource | Verified offer | Remaining check |
|---|---|---|
| Qloo API access | Official [resources](https://qloo.devpost.com/resources) link an [event key request form](https://docs.google.com/forms/d/1G_udB8rJTlSwwCx9LF1vaftYI4Qf459ZXIKqLPElWc8/viewform). | Approval, quota, expiry and endpoints; no unlimited allocation or monetary credit established. |
| Starter kit | [Official repository](https://github.com/qloo/qloo-hackathon-kit). | Node >=22.19.0; harness >=0.1.26. Installed Node is 22.14.0. |
| Support | Discord linked from official resources. | Use issued support details if needed. |
| LLM / hosting credits | None listed on inspected resources or kit. | Treat as our responsibility unless organizers confirm. Prizes are not build credits. |

The [access document](https://github.com/qloo/qloo-hackathon-kit/blob/main/docs/API_ACCESS.md) says issuance should specify limits and expiration. Numerical quotas are not public there. All access surfaces share quota. Necessary bounded caching is permitted; bulk reconstruction is not.

## What we need

1. **Event registration and Qloo key request.** The form asks for email, name, Devpost username, country, project description and terms acceptance. GitHub username is optional. The user should complete account/terms steps and keep secrets out of chat.
2. **One LLM API provider supporting tool calls.** User reports access. The [official rules](https://qloo.devpost.com/rules), rechecked October 3, do not mandate a model provider; they require Qloo integration and an agentic tool, framework or existing agent integration. Confirm provider and that it is API access; a chat subscription alone does not establish API entitlement. Configure the key locally on the backend and agree on a spend limit before paid testing.
3. **Compatible Node runtime.** Current sample works on installed Node 22.14; live harness requires >=22.19. No machine-wide update has been made.
4. **Public hosting later.** The documented [MCP starter](https://github.com/qloo/qloo-hackathon-kit/blob/main/starter/mcp-client/README.md) needs a Node backend on a VM/container that can launch the local Qloo process; that route does not support serverless deployment. Select hosting/budget before publishing. A custom domain is optional.
5. **Real venue tests.** Start with 3–5 public cafés in one city to check Qloo coverage. Independently establish staffing, seats and supplier quotes. Owner feedback is needed to test usefulness. Aggregate venue affinity does not describe Tuesday's actual visitors.

No database, paid design assets, maps subscription or private business dataset is needed for this first slice. No paid service is required to run the local sample. Live monthly costs depend on provider, usage and hosting choices and are not yet established.

### Description for the Qloo request

Tuesday Fix helps independent cafés turn quiet evenings into culturally relevant events they can actually run. It uses Qloo taste affinities to propose themes, checks staffing, capacity and budget constraints, and produces a revisable event plan and invitation draft.

## Build sequence

| Stage | Deliverable | Status |
|---|---|---|
| First-use experience | Brief, sample inspirations, constrained format, staffing/budget repair, invitation download | Implemented locally |
| Sponsor coverage | Resolve real venues or explicit taste seeds, confirm ambiguous matches, test cultural categories | Needs Qloo key |
| Live agent | Tool-driven cultural suggestions and grounded draft generation; enforce hard constraints independently | Needs confirmed LLM API setup and Qloo |
| Operational detail | Editable supplier costs, dates, usable space, preparation checklist and owner review | Planned |
| Validation | Compare Qloo choices against equally informed generic alternatives; measure owner usefulness | Not performed |
| Submission | Public functioning app, public source/run instructions/open-source license and description | Not published |

Architecture: browser → backend agent → Qloo entity resolution/affinity tools → event proposals → deterministic constraints → owner revisions. Discover actual tool schemas and validate real responses; do not invent Qloo IDs or response formats. Credentials remain on the backend.

Qloo supports aggregate cultural relevance, not event availability, supplier quotes, staffing facts, attendance or revenue predictions. Sample costs must become editable before real operator use.

## Deadline

The [official overview](https://qloo.devpost.com/) lists October 30, 2026, 11:45 p.m. EDT: **October 31, 2026, 9:15 a.m. IST**. Public functioning app and repository required; demo video not required. Recheck official rules before submission.
