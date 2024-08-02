import BaseCommand from "@/abstractions/BaseCommand";
import { SnowflakeType } from "@/enums/SnowflakeType";
import { SlashCommandBuilder } from "discord.js";

export class SettingsCommand extends BaseCommand {
  constructor() {
    super({
      isSlash: true,
      type: SnowflakeType.Everyone,
      builder: new SlashCommandBuilder()
        .setName(`log-settings`)
        .setDescription(`Настройка логгирования`)
    })
  }
}