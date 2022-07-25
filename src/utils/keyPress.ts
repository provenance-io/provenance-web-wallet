// Handle a keypress event on an element
export const keyPress = (
  event: React.KeyboardEvent,
  targetKey: string,
  callback: () => void
) => {
  if (event.key === targetKey) callback();
};
