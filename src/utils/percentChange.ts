export const percentChange = (from: number, to: number, fixed = 2) => {
  // ((v2 - v1) / |v1|) * 100 [change from v1 to v2]
  const numerator = to - from;
  const denominator = Math.abs(from);
  const rawValue = Math.abs(numerator / denominator);
  return `${(rawValue * 100).toFixed(fixed)}%`;
};
