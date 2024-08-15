import BaseCommand from "@/abstractions/BaseCommand";
import { SnowflakeColors, SnowflakeType } from "@/enums";
import {
  ReactionModuleDocument,
  ReactionModuleModel,
} from "@/models/reactions.model";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  ChannelType,
  CommandInteraction,
  EmbedBuilder,
  Guild,
  SlashCommandBuilder,
} from "discord.js";
import { reactionModuleResponse } from "./response";

export class SetupCommand extends BaseCommand {
  constructor() {
    super({
      isSlash: true,
      builder: new SlashCommandBuilder()
        .setName(`reactions-settings`)
        .setDescription(`Настройка модуля реакций`)
        .setDMPermission(false),
      type: SnowflakeType.Everyone,
    });
  }
  public async execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    try {
      const response = await reactionModuleResponse(interaction);
      return interaction.editReply({ ...response });
    } catch (err) {
      console.log(err);
      return interaction.editReply({
        embeds: [],
        content: `Упс, что-то пошло не так`,
      });
    }
  }
}
