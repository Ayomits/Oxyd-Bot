import BaseComponent from "@/abstractions/BaseComponent";
import { ButtonInteraction } from "discord.js";
import { reactionModuleResponse } from "./response";
import { ReactionModuleModel } from "@/models/reactions.model";

export class RefreshButton extends BaseComponent {
  constructor() {
    super("toggleReactionModule");
  }
  async execute(interaction: ButtonInteraction, args?: string[]) {
    const authorId = args[0];
    if (authorId !== interaction.user.id) return;
    await interaction.deferReply({ ephemeral: true });
    try {
      const isEnabled = Boolean(args[2]);

      interaction.editReply({
        content: `Успешно ${
          !isEnabled === true ? "включен" : "выключен"
        } модуль реакций`,
      });
      await ReactionModuleModel.updateOne(
        {
          guildId: interaction.guild.id,
        },
        {
          enable: !isEnabled,
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
