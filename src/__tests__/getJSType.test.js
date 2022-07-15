import { getJSType } from 'utils';

const testData = [
  { value: 'test', result: 'string' },
  { value: 1, result: 'number' },
  { value: [1, 2], result: 'array' },
  { value: { test: 1 }, result: 'object' },
  { value: null, result: 'null' },
  { value: false, result: 'boolean'},
  { result: 'undefined' },
];

describe('Make sure util correctly returns proper types', () => {
  testData.forEach(({ value, result }) => {
    test(`testing ${value}`, () => {
      expect(getJSType(value)).toBe(result);
    })
  });
});