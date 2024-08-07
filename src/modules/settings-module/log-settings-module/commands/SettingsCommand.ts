import BaseCommand from "@/abstractions/BaseCommand";
import prisma from "@/db/prisma";
import { SnowflakeColors, SnowflakeLanguage } from "@/enums";
import { SnowflakeMentionType } from "@/enums/SnowflakeMentionType";
import { SnowflakeType } from "@/enums/SnowflakeType";
import { mention } from "@/utils/functions/mentions";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import { settingsResponse } from "./SettingsResposne";

export class SettingsCommand extends BaseCommand {
  constructor() {
    super({
      isSlash: true,
      type: SnowflakeType.Everyone,
      builder: new SlashCommandBuilder()
        .setName(`log-settings`)
        .setDescription(`Настройка логгирования`),
    });
  }

  async execute(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const res = await settingsResponse(interaction);
    return interaction.editReply(res);
  }
}
