// Handle a keypress event on an element
export const keyPress = (
  event: React.KeyboardEvent,
  callback: () => void,
  targetKey: string = 'Enter'
) => {
  if (event.key === targetKey) {
    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    callback();
  }
};
