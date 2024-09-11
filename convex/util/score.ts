export function assignScore() {
  const max = 100;
  const min = 50;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
