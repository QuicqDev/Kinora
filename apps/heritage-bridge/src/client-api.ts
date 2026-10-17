import { staticDemo } from './demo-mode';
import { sampleRequest } from './sample-api';

// Static builds never enter fetch. CSP also forbids all outbound connections.
export const clientRequest: typeof fetch = staticDemo ? sampleRequest : (...args) => fetch(...args);
