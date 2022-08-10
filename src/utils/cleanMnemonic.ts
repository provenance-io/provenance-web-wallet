// const mnumonic = value.match(/(?<=\d+|\b)([a-zA-Z]+)(?=\d+|\b)/gm);

// Take in a string value and try to pull out all mnemonic values from it
export const cleanMnemonic = (mnemonic: string): string[] => {
  // Take the string and clean out all special characters
  // const resultArray = mnemonic.match(/(?<=\d+|\b)([a-zA-Z]+)(?=\d+|\b)/gm);
  const resultArray = mnemonic.match(
    /(?<=\d+|\b|[^/w])([a-zA-Z]+)(?=\d+|\b|[^/w])/gm
  );
  return resultArray ? resultArray : [];
};
