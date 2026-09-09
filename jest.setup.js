// jest.setup.js
const dc = require('diagnostics_channel');

if (!dc.tracingChannel) {
  dc.tracingChannel = () => ({
    subscribe: () => {},
    unsubscribe: () => {},
    traceSync: (fn) => fn(),
    tracePromise: (fn) => fn(),
    hasSubscribers: false,
  });
}