// Capitalize and clean the passed in string/word
// Eg: "hello world" => "Hello World"
// Eg: "hEllO" => "Hello"
// Eg: "hELLo_wOrlD" => "Hello World"

export const capitalize = (
  str: string = '',
  type: 'default' | 'camelcase' | 'uppercase' = 'default'
) => {
  if (!str || typeof str !== 'string') return str;
  // Camel case work ('addressIndex' => 'Address Index')
  if (type === 'camelcase')
    return str
      .replace(/([A-Z])/g, ' $1') // Insert a space before all caps
      .replace(/^./, function (str) {
        return str.toUpperCase();
      }); // Uppercase the first character
  if (type === 'uppercase') return str.toUpperCase(); // Uppercase the whole word
  // Default word
  return str
    .replaceAll('_', ' ')
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
    .join(' ');
};
