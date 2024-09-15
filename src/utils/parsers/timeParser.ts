export function timeParser(format: Date | string): string | Date | null {
  const absoluteDateRegex = /(\d{2})\.(\d{2})\.(\d{2}) (\d{2}):(\d{2})/;

  const relativeTimeRegex = /(\d+)([yMdhms])/;

  const timeOnlyRegex = /(\d{2}):(\d{2})/;

  if (typeof format === "string") {
    if (absoluteDateRegex.test(format)) {
      const match = format.match(absoluteDateRegex);
      if (match) {
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1;
        const year = 2000 + parseInt(match[3], 10);
        const hours = parseInt(match[4], 10);
        const minutes = parseInt(match[5], 10);

        return new Date(year, month, day, hours, minutes);
      }
    }

    if (timeOnlyRegex.test(format)) {
      const match = format.match(timeOnlyRegex);
      if (match) {
        const now = new Date();
        const hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);

        return new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          hours,
          minutes
        );
      }
    }

    if (relativeTimeRegex.test(format)) {
      const match = format.match(relativeTimeRegex);
      if (match) {
        const value = parseInt(match[1], 10);
        const unit = match[2];
        const now = new Date();

        switch (unit) {
          case "y":
            now.setFullYear(now.getFullYear() + value);
            break;
          case "M":
            now.setMonth(now.getMonth() + value);
            break;
          case "d":
            now.setDate(now.getDate() + value);
            break;
          case "h":
            now.setHours(now.getHours() + value);
            break;
          case "m":
            now.setMinutes(now.getMinutes() + value);
            break;
          case "s":
            now.setSeconds(now.getSeconds() + value);
            break;
        }
        return now;
      }
    }

    return null;
  } else if (format instanceof Date) {
    const day = String(format.getDate()).padStart(2, "0");
    const month = String(format.getMonth() + 1).padStart(2, "0");
    const year = String(format.getFullYear()).slice(-2);
    const hours = String(format.getHours()).padStart(2, "0");
    const minutes = String(format.getMinutes()).padStart(2, "0");

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  return null;
}
