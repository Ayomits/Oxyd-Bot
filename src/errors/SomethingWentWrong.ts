import { BaseCommandError } from "@/abstractions/BaseError";
import { SnowflakeColors } from "@/enums";

export class SomethingWentWrong extends BaseCommandError {
  constructor(
    interaction: any,
    ephemeral: boolean = false,
    mustReply: boolean = false
  ) {
    super({
      title: `Ошибка`,
      description: `Что-то пошло не так`,
      color: SnowflakeColors.DEFAULT,
      interaction: interaction,
      isMustReply: mustReply,
      ephemeral: ephemeral,
    });
  }
}
