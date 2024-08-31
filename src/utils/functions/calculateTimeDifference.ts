export function calculateTimeDifference(start: Date, end: Date): string {
  const diffMs = end.getTime() - start.getTime();

  const months = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30));
  const days = Math.floor((diffMs % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  let result = "";
  if (months) result += `${months} ${getDeclension(months, 'месяц', 'месяца', 'месяцев')} `;
  if (days) result += `${days} ${getDeclension(days, 'день', 'дня', 'дней')} `;
  if (hours) result += `${hours} ${getDeclension(hours, 'час', 'часа', 'часов')} `;
  if (minutes) result += `${minutes} ${getDeclension(minutes, 'минута', 'минуты', 'минут')} `;
  if (seconds || !result) result += `${seconds} ${getDeclension(seconds, 'секунда', 'секунды', 'секунд')}`;

  return result.trim();
}

function getDeclension(number: number, singular: string, few: string, many: string): string {
  const mod100 = number % 100;
  const mod10 = number % 10;

  if (mod100 > 10 && mod100 < 20) {
    return many;
  } else if (mod10 > 1 && mod10 < 5) {
    return few;
  } else if (mod10 === 1) {
    return singular;
  } else {
    return many;
  }
}
