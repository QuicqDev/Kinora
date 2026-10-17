// Build-time constant, absent in server-side unit tests.
declare const __KINORA_STATIC_DEMO__: boolean;
export const staticDemo = typeof __KINORA_STATIC_DEMO__ !== 'undefined' && __KINORA_STATIC_DEMO__;
