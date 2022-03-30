export const isMnumonic = (value: string, minLength: number) => {
  if (!value || !minLength) return false;
  // If the length isn't at least 48 chars just return false
  if (value.length < 48) return false;
  // alpha beta charlie delta
  const mnumonic = value.match(/(?<=\d+|\b)([a-zA-Z]+)(?=\d+|\b)/gm);
  // If the length of words matches what we expect
  return (mnumonic && mnumonic.length === minLength) ? mnumonic : false;
};
