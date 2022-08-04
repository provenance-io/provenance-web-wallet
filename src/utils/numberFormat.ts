export const numberFormat = (
  rawValue: number | string,
  digits: number = 1,
  extraOptions: {
    shorthand?: boolean;
    maximumFractionDigits?: number;
    minimumSignificantDigits?: number;
    maximumSignificantDigits?: number;
  } = {}
) => {
  // If we don't have a value to start with just return it
  if (
    rawValue === null ||
    rawValue === undefined ||
    rawValue === '' ||
    rawValue === '--'
  )
    return rawValue;

  // If we get a string, convert it to a number
  const value = typeof rawValue === 'string' ? Number(rawValue) : rawValue;

  // If we just want to shorthand a number, don't bother with other calculations
  // Eg: numberFormat(1245, 3, { shorthand: true }) => 1.24K
  // Eg: numberFormat(1245000, 3, { shorthand: true }) => 1.24M
  // Eg: numberFormat(1245000000, 3, { shorthand: true }) => 1.24B
  if (extraOptions.shorthand) {
    let letter = ''; // Under Thousand
    let roundedValue = value;
    const trillion = 1e12;
    const billion = 1e9;
    const million = 1e6;
    const thousand = 1e3;
    if (value >= trillion) {
      letter = 'T';
      roundedValue = value / trillion;
    } else if (value >= billion) {
      letter = 'B';
      roundedValue = value / billion;
    } else if (value >= million) {
      letter = 'M';
      roundedValue = value / million;
    } else if (value >= thousand) {
      letter = 'K';
      roundedValue = value / thousand;
    }
    const finalValue = roundedValue.toLocaleString('en-US', {
      maximumFractionDigits: digits,
      minimumSignificantDigits: extraOptions.minimumSignificantDigits,
      maximumSignificantDigits: extraOptions.maximumSignificantDigits,
    });
    return `${finalValue}${letter}`;
  }

  let options = {};
  // Amount of significant digits to return in string
  if (typeof digits === 'number' && digits >= 0) {
    options = { maximumFractionDigits: digits };
  }

  return value.toLocaleString('en-US', { ...options, ...extraOptions });
};
