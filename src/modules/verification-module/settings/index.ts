import BaseCommand from "@/abstractions/BaseCommand";
import { SnowflakeType } from "@/enums";
import { SomethingWentWrong } from "@/errors/SomethingWentWrong";
import {
  CommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { VerificationResponse } from "./Response";

export class VerificationSettings extends BaseCommand {
  constructor() {
    super({
      type: SnowflakeType.Everyone,
      isSlash: true,
      builder: new SlashCommandBuilder()
        .setName(`verification-settings`)
        .setDescription(`Настройки модуля верификации`)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    });
  }

  public async execute(interaction: CommandInteraction) {
    try {
      await interaction.deferReply({ ephemeral: true });
      return interaction.editReply(await VerificationResponse(interaction));
    } catch {
      return new SomethingWentWrong(interaction);
    }
  }
}
