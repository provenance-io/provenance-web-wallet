export const WC_NOTIFICATION_TYPES = [
  'connect',
  'disconnect',
  'session_request',
  'provenance_sign',
  'provenance_sendTransaction',
  'request_failed', // Custom notification type when some data is malformed
];

export const WC_CONNECTION_TIMEOUT = 1800000; // ms (30min)
