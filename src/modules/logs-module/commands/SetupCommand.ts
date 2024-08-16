import BaseCommand from "@/abstractions/BaseCommand";
import { SnowflakeType } from "@/enums";
import { LogModuleModel } from "@/models/logs.model";
import { isEnabled } from "@/utils/functions/isEnabled";
import {
  CommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";

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
    const logSettings =
      (await LogModuleModel.findOne({
        guildId: interaction.guild.id,
      })) || (await LogModuleModel.create({ guildId: interaction.guild.id }));
    const embed = new EmbedBuilder()
      .setTitle(`Настройка модуля логгирования`)
      .setFields(
        {
          name: `> Состояние логов сообщений`,
          value: `${isEnabled(logSettings.message.enable)}`,
        },
        {
          name: `> Состояние логов голосовых каналов`,
          value: `${isEnabled(logSettings.message.enable)}`,
        }
      );
  }
}
