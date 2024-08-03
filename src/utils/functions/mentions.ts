import { SnowflakeLanguage } from "@/enums";
import { SnowflakeMentionType } from "@/enums/SnowflakeMentionType";
import { Snowflake } from "discord.js";

export function mention(
  snowflake: Snowflake | null,
  type: SnowflakeMentionType,
  lang: SnowflakeLanguage = SnowflakeLanguage.ENGLISH
): string {
  if (!snowflake) {
    switch (lang) {
      case SnowflakeLanguage.RUSSIAN:
        return "Нет";
      case SnowflakeLanguage.ENGLISH:
        return "None";
    }
  }
  switch (type) {
    case SnowflakeMentionType.ROLE:
      return `<@&${snowflake}>`;
    case SnowflakeMentionType.CHANNEL:
      return `<#${snowflake}>`;
    case SnowflakeMentionType.USER:
      return `<@${snowflake}>`;
  }
}
