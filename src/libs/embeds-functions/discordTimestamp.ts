import { SnowflakeTimestamp } from "@/enums/SnowflkeTimestamp";

export function discordTimestampFormat(
  timestamp: number,
  type: SnowflakeTimestamp
): string {
  return `<t:${Math.floor(timestamp)}:${type}>`;
}
