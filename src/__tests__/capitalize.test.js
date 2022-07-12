import { capitalize } from 'utils';

// Eg: "hello world" => "Hello World"
// Eg: "hEllO" => "Hello"
// Eg: "hELLo_wOrlD" => "Hello World"

// Map of all text data in the form of [string, result]
const testData = [
  {
    type: 'default',
    string: 'hello world',
    result: 'Hello World',
  },
  {
    type: 'default',
    string: 'hEllO',
    result: 'Hello',
  },
  {
    type: 'default',
    string: 'hELLo_wOrlD',
    result: 'Hello World',
  },
  {
    type: 'camelcase',
    string: 'camelCase',
    result: 'Camel Case',
  },
  {
    type: 'default',
    string: 12345,
    result: 12345,
  },
  {
    type: 'default',
    string: '',
    result: '',
  },
  {
    type: 'uppercase',
    string: 'hash',
    result: 'HASH',
  },
  {
    type: 'uppercase',
    string: 'haSH',
    result: 'HASH',
  },
];

// ---------------------------------------------------------------
// Test various words to see if they are properly capitalized
// ---------------------------------------------------------------
describe('Capitalize a list of words properly', () => {
  testData.forEach(({ type, string, result }) => {
    test(`capitalize "${string}" to be "${result}"`, () => {
      expect(capitalize(string, type)).toBe(result);
    })
  });
});