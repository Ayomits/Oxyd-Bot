import BaseCommand from "@/abstractions/BaseCommand";
import { SnowflakeType } from "@/enums";
import {
  CommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
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
    await interaction.deferReply({ ephemeral: true });
    return interaction.editReply(await settingsResponse(interaction));
  }
}
