import BaseCommand from "@/abstractions/BaseCommand";
import { SnowflakeType } from "@/enums";
import Logger from "@/utils/system/Logger";
import {
  ActionRowBuilder,
  ButtonBuilder,
  CommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";

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

      return interaction.editReply({});
    } catch (err) {
      interaction.editReply({ content: `Что-то пошло не так..` });
      Logger.error(err);
    }
  }
}
