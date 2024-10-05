import BaseCommand from "@/abstractions/BaseCommand";
import { SnowflakeType } from "@/enums";

import {
  ActionRowBuilder,
  ButtonBuilder,
  CommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { BumpReminderResponse } from "./BumpReminderResponse";
import { SomethingWentWrong } from "@/errors/SomethingWentWrong";
import Logger from "@/libs/core-functions/Logger";

export class BumpReminderSettings extends BaseCommand {
  constructor() {
    super({
      isSlash: true,
      builder: new SlashCommandBuilder()
        .setName(`bumpreminder-settings`)
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDescription(`Настройка системы напоминаний для мониторингов`),
      type: SnowflakeType.Everyone,
    });
  }

  public async execute(interaction: CommandInteraction) {
    try {
      await interaction.deferReply({ ephemeral: true });
      return interaction.editReply(await BumpReminderResponse(interaction));
    } catch (err) {
      Logger.error(err);
      return new SomethingWentWrong(interaction);
    }
  }
}
