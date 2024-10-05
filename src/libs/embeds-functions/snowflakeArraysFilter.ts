import { SnowflakeMentionType } from "@/enums/SnowflakeMentionType";
import { Guild, Snowflake } from "discord.js";
import { mention } from "./mentions";

export function snowflakeArraysFilter(
  arr: any[],
  guild: Guild,
  key: any,
  mentionType: SnowflakeMentionType = SnowflakeMentionType.CHANNEL
) {
  return arr.length >= 1
    ? arr
        .filter((val) => guild[key].cache.get(val))
        .map((val) => mention(val as Snowflake, mentionType))
        .join(" ")
    : "Нет";
}
