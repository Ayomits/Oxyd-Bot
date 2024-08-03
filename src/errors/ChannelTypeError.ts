import { BaseCommandError } from "@/abstractions/BaseError";
import { SnowflakeColors } from "@/enums";

export class ChannelTypeError extends BaseCommandError {
  constructor(
    interaction: any,
    ephemeral: boolean = false,
    mustReply: boolean = false
  ) {
    super({
      title: `Ошибка`,
      description: `Указанный канал **не** является текстовым`,
      color: SnowflakeColors.DEFAULT,
      interaction: interaction,
      isMustReply: mustReply,
      ephemeral: ephemeral,
    });
  }
}
