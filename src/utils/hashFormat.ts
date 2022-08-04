export const hashFormat = (
  amount: number | string,
  amountType: 'nhash' | 'hash' = 'nhash',
  fixedAmount: number = 9
): number => {
  const valueString = `${amount}`;
  const exponentialValue = 1e-9;
  const floatedNumber = Number(Number.parseFloat(valueString));
  const rawResult =
    amountType === 'nhash'
      ? floatedNumber * exponentialValue
      : (floatedNumber / exponentialValue).toPrecision(12);
  return Number(Number(rawResult).toFixed(fixedAmount));
};
