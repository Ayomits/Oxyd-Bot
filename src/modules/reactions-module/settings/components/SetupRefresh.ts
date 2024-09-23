import BaseComponent from "@/abstractions/BaseComponent";
import { ButtonInteraction } from "discord.js";
import { reactionModuleResponse } from "../SetupResponse";

export class RefreshButton extends BaseComponent {
  constructor() {
    super("reactionRefresh", 600);
  }
  async execute(interaction: ButtonInteraction, args?: string[]) {
    const authorId = args[0];
    if (authorId !== interaction.user.id) return;
    await interaction.deferUpdate();
    try {
      const res = await reactionModuleResponse(interaction);
      await interaction.editReply({ ...res });
    } catch {
      await interaction.editReply({
        embeds: [],
        content: "Произошло ошибка при попытке прогрузить настройки",
      });
    }
  }
}
