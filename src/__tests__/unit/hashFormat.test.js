import { hashFormat } from 'utils/hashFormat';

const testData = [
  {
    amount: 891732518128,
    amountType: 'nhash',
    result: 891.732518128,
  },
  {
    amount: 891.732518128,
    amountType: 'hash',
    result: 891732518128,
  },
  {
    amount: 1,
    amountType: 'hash',
    result: 1000000000,
  },
  {
    amount: 1,
    amountType: 'nhash',
    result: 0.000000001,
  },
  {
    amount: 3.8e-11,
    amountType: 'hash',
    result: 0.038,
  },
];

// -------------------------------------------------------------------
// Test various amounts of nhash to see proper conversion to hash
// -------------------------------------------------------------------
describe('Convert nhash to hash and hash to nhash correctly', () => {
  testData.forEach(({ amount, amountType, result, fixedAmount }) => {
    test(`convert ${amount} ${amountType}`, () => {
      expect(hashFormat(amount, amountType, fixedAmount)).toBe(result);
    });
  });
});
