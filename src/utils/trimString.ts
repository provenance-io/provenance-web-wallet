// Limit the maxLength of a string
// ellipsisIndex arg will add ellipsis at that index (defaults to the end)
// Examples:
// trimString('fantastic', 3, -1) => 'fan...';
// trimString('fantastic', 3, 2) => 'fa...c'
// trimString('fantastic', 6, 1) => 'f...astic'
// trimString('fantastic', 6, 3) => 'fan...tic'
// trimString('fantastic', 3, 0) => '...tic'

export const trimString = (
  text: string,
  maxLength: number,
  ellipsisIndex: number = -1, // Note: 0 is start of text, -1 is end of text.
  ellipsisValue: string = '...'
) => {
  const textLength = text.length;
  // If maxLength is 0, just return the ellipsis
  if (!maxLength) return ellipsisValue;
  // Text must be a string, if it isn't return whatever was passed in
  if (typeof text !== 'string') return text;
  // EllipsisIndex requested past the length of the string
  if (ellipsisIndex > maxLength) return text;
  // If the text is shorter than the max, just return it
  if (textLength <= maxLength) return text;
  // Ellipsis at end (ellipsisIndex -1 | Prov...)
  if (ellipsisIndex === -1) return text.slice(0, maxLength - textLength).concat(ellipsisValue);
  // Ellipsis at start (ellipsisIndex 0 | ...ance)
  if (ellipsisIndex === 0) return ''.concat(ellipsisValue, text.slice(textLength - maxLength));
  // Ellipsis middle (ellipsisIndex >0 | Pr...ce)
  const front = text.slice(0, ellipsisIndex);
  const back = text.split('').reverse().join('').slice(0, maxLength - ellipsisIndex).split('').reverse().join('');
  return ''.concat(front, ellipsisValue, back);
};

export const trimAddress = (fullAddress: string) => trimString(fullAddress, 11, 3);
