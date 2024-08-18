import BaseCommand from "@/abstractions/BaseCommand";
import { SnowflakeType } from "@/enums";
import {
  VerificationModuleModel,
  VerificationModuleSchema,
} from "@/models/VerificationModel";
import Logger from "@/utils/system/Logger";
import {
  CommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";

export class SetupCommand extends BaseCommand {
  constructor() {
    super({
      type: SnowflakeType.Everyone,
      isSlash: true,
      builder: new SlashCommandBuilder()
        .setName(`verification-settings`)
        .setDescription(`Настройка модуля верификации`)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    });
  }

  async execute(interaction: CommandInteraction) {
    try {
      const verificationSettings =
        (await VerificationModuleModel.findOne({
          guildId: interaction.guild.id,
        })) ||
        (await VerificationModuleModel.create({
          guildId: interaction.guild.id,
        }));
    } catch (err) {
      Logger.error(err);
    }
  }
}
