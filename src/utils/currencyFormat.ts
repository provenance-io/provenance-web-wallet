import { numberFormat } from './numberFormat';

export const currencyFormat = (
  value: number | string,
  prefix?: string,
  suffix?: string
) => {
  // If number, convert to string
  const valueString = typeof value === 'string' ? value : `${value}`;
  // Formatting function for currency
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });
  // Clone valueString to modify it
  let finalResult = valueString;
  // If the number we get is over 1 billion, shorthand it
  if (Number(finalResult) > 1e9)
    finalResult = numberFormat(finalResult, 2, {
      shorthand: true,
      minimumSignificantDigits: 3,
      maximumSignificantDigits: 3,
    });
  else {
    finalResult = formatter.format(Number(finalResult));
    // Remove the first character of the result to add custom prefix: '$100.00' => '€100.00'
    finalResult = finalResult.substring(1);
  }
  // Add custom prefix if needed
  if (prefix) finalResult = prefix + finalResult;
  if (suffix) finalResult = finalResult + suffix;
  return finalResult;
};
