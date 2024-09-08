export function formatNumber(number: number) {
  const million = number / 1_000_000;
  const thousand = number / 1_000;
  if (million >= 1) return `${million.toFixed(1)}kk`;
  if (thousand) return `${thousand.toFixed(1)}k`;
  return `${number}`;
}
