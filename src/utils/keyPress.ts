// Handle a keypress event on an element
export const keyPress = (
  event: React.KeyboardEvent,
  targetKey: string,
  callback: () => void
) => {
  if (event.key === targetKey) {
    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    callback();
  }
};
