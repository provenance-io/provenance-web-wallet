// TODO: There's no way this is accurate or safe to use, replace this
export const hashFormat = (amount: number | string, amountType: 'nhash' | 'hash' = 'nhash'): number => {
  const valueString = `${amount}`;
  const exponentialValue = 1e-9;
  const floatAmount = 15;
  const floatedNumber = Number(Number.parseFloat(valueString).toFixed(floatAmount));
  const rawResult = amountType === 'nhash' ? floatedNumber * exponentialValue : Math.round(floatedNumber / exponentialValue);
  return Number(rawResult);
};
