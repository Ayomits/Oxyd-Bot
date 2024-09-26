import BaseCommand from "@/abstractions/BaseCommand";
import { SnowflakeType } from "@/enums";
import {
  CommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { EconomySettingsResponse } from "./Response";

export class EconomyBaseSettings extends BaseCommand {
  constructor() {
    super({
      isSlash: true,
      type: SnowflakeType.Everyone,
      builder: new SlashCommandBuilder()
        .setName(`economy-settings`)
        .setDescription(`Общие настройки экономики`)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    });
  }

  async execute(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });
    return interaction.editReply(await EconomySettingsResponse(interaction));
  }
}
