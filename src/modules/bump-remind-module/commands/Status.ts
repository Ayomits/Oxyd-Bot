import BaseCommand from "@/abstractions/BaseCommand";
import { SnowflakeType } from "@/enums";
import { SomethingWentWrong } from "@/errors/SomethingWentWrong";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { bumpReminderStatusResponse } from "./Response";
import Logger from "@/utils/system/Logger";

export class BumpReminderStatus extends BaseCommand {
  constructor() {
    super({
      builder: new SlashCommandBuilder()
        .setName(`bumpreminder-status`)
        .setDescription(
          `Проверка времени до использования команд мониторингов`
        ),
      type: SnowflakeType.Everyone,
      isSlash: true,
    });
  }

  public async execute(interaction: CommandInteraction) {
    try {
      await interaction.deferReply();
      interaction.editReply(await bumpReminderStatusResponse(interaction));
    } catch (err) {
      Logger.error(err);
      new SomethingWentWrong(interaction);
    }
  }
}
