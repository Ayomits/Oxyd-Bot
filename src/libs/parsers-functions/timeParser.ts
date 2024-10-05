export function timeParser(format: Date | string): string | Date | null {
  const absoluteDateRegex = /(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2})/;

  const relativeTimeRegex = /(\d+)([yMdhms])/;

  const timeOnlyRegex = /(\d{2}):(\d{2})/;

  if (typeof format === "string") {
    if (absoluteDateRegex.test(format)) {
      const match = format.match(absoluteDateRegex);
      if (match) {
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1;
        const year = parseInt(match[3], 10);
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
      let tempNumber = "";
      let totalCount = 0
      const times = {
        Y: 31_536_000_000,
        M: 2_419_200_000,
        w: 604_800_000,
        d: 86_400_000,
        h: 3_600_000,
        m: 60_000,
        s: 1_000,
      };
      for (const char of format) {
        if (times[char]) {
          totalCount += Number(tempNumber) * times[char]
        }else {
          tempNumber = char
        }
      }
      const now = new Date()
      now.setTime(now.getTime() + totalCount)
      return 
    }

    return null;
  } else if (format instanceof Date) {
    const day = String(format.getDate()).padStart(2, "0");
    const month = String(format.getMonth() + 1).padStart(2, "0");
    const year = String(format.getFullYear()).slice(-4);
    const hours = String(format.getHours()).padStart(2, "0");
    const minutes = String(format.getMinutes()).padStart(2, "0");

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  return null;
}
