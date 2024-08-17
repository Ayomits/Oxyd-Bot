import BaseCommand from "@/abstractions/BaseCommand";
import { SnowflakeColors, SnowflakeType } from "@/enums";
import { LogModuleModel } from "@/models/LogsModel";
import { isEnabled } from "@/utils/functions/isEnabled";
import {
  ActionRowBuilder,
  CommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import { settingsResponse } from "./SetupResponse";

export class SetupLogs extends BaseCommand {
  constructor() {
    super({
      builder: new SlashCommandBuilder()
        .setName(`logs-settings`)
        .setDescription(`Настройка системы логгирования`)
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
      isSlash: true,
      type: SnowflakeType.Everyone,
    });
  }

  public async execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    return interaction.editReply(await settingsResponse(interaction));
  }
}
