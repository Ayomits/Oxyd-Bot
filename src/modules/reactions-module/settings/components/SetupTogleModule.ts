import BaseComponent from "@/abstractions/BaseComponent";
import { ButtonInteraction } from "discord.js";
import { reactionModuleResponse } from "../SetupResponse";
import { ReactionModuleModel } from "@/db/models/economy/ReactionsModel";

export class SetupToggleModule extends BaseComponent {
  constructor() {
    super({
      customId: "toggleReactionModule",
      ttl: 600,
      authorOnly: true,
    });
  }
  async execute(interaction: ButtonInteraction, args?: string[]) {
    const authorId = args[0];
    if (authorId !== interaction.user.id) return;
    await interaction.deferReply({ ephemeral: true });
    try {
      const { enable } = await ReactionModuleModel.findOne({
        guildId: interaction.guild.id,
      });

      interaction.editReply({
        content: `Успешно ${
          !enable === true ? "включен" : "выключен"
        } модуль реакций`,
      });
      await ReactionModuleModel.updateOne(
        {
          guildId: interaction.guild.id,
        },
        {
          $set: {
            enable: enable ? !enable : true,
          },
        }
      );
    } catch {
      await interaction.editReply({
        embeds: [],
        content: "Произошло ошибка при попытке обновить настройки",
      });
    }
  }
}
