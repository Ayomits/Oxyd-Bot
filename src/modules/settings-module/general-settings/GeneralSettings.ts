import BaseCommand from "@/abstractions/BaseCommand";
import { SnowflakeType } from "@/enums";
import GuildService from "@/modules/guilds-module/shared/GuildService";
import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export class GeneralSettingsCommand extends BaseCommand {
  constructor() {
    super({
      isSlash: true,
      builder: new SlashCommandBuilder()
        .setName(`general-settings`)
        .setDescription(`Общая настройка бота`),
      type: SnowflakeType.Everyone,
    });
  }

  async execute(interaction: CommandInteraction) {
    const guild = await GuildService.findOne(interaction.guild.id);
    if (!guild) {
      await GuildService.createBlank(interaction.guild.id);
      return await this.execute(interaction);
    }
    const embed = new EmbedBuilder()
      
  }
}
