export const getJSType = (obj: any) => {
  if (Array.isArray(obj)) return 'array';
  if (typeof obj === 'string') return 'string';
  if (typeof obj === 'number') return 'number';
  if (typeof obj === 'boolean') return 'boolean';
  if (obj === null) return 'null';
  // Run this test after others since js labels multiple things as objects
  if (typeof obj === 'object') return 'object';
  return typeof obj;
};
