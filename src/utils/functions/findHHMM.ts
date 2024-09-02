export function findHHMMSS(timeString: string): number {
  const [hours, minutes, seconds] = timeString.match(/\d{2}/g).map(Number);
  return (hours * 3600 + minutes * 60 + seconds) * 1000;
}