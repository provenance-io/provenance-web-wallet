export const randomizeArray = (
  array: string[],
  returnAmount: number = array.length
): string[] => {
  const finalArray = [...array];
  for (let index = array.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [finalArray[index], finalArray[randomIndex]] = [
      finalArray[randomIndex],
      finalArray[index],
    ];
  }
  return finalArray.slice(0, returnAmount);
};
