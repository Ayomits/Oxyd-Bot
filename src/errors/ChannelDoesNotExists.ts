import { BaseCommandError } from "@/abstractions/BaseError";
import { SnowflakeColors } from "@/enums";

export class ChannelDoesNotExists extends BaseCommandError {
  constructor(
    interaction: any,
    ephemeral: boolean = false,
    mustReply: boolean = false
  ) {
    super({
      title: `Ошибка`,
      description: `Указанный канал **не существует**`,
      color: SnowflakeColors.DEFAULT,
      interaction: interaction,
      isMustReply: mustReply,
      ephemeral: ephemeral,
    });
  }
}
