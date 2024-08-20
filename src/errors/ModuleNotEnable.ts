import { BaseCommandError } from "@/abstractions/BaseError";
import { SnowflakeColors } from "@/enums";

export class ModuleNotEnable extends BaseCommandError {
  constructor(
    interaction: any,
    command: string,
    ephemeral: boolean = false,
    mustReply: boolean = false
  ) {
    super({
      title: `Ошибка`,
      description: `Модуль чьи команды Вы используете не включен. Вы сможете включить его командой \`${command}\``,
      color: SnowflakeColors.DEFAULT,
      interaction: interaction,
      isMustReply: mustReply,
      ephemeral: ephemeral,
    });
  }
}
