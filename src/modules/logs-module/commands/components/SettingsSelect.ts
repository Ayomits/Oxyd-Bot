import BaseComponent from "@/abstractions/BaseComponent";
import {
  ActionRowBuilder,
  ModalBuilder,
  StringSelectMenuInteraction,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

export class SettingsSelect extends BaseComponent {
  constructor() {
    super("logSelect");
  }

  async execute(interaction: StringSelectMenuInteraction) {
    const value = interaction.values[0];
    const modal = new ModalBuilder()
      .setCustomId(`settingsModal_${value}`)
      .setTitle(`Настройка логгирования`);
    const channelId = new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId(`channelId`)
        .setLabel(`Айди канала`)
        .setPlaceholder(`1268160506623950868`)
        .setRequired(false)
        .setStyle(TextInputStyle.Short)
        .setMaxLength(21)
        .setMinLength(17)
    );
    modal.addComponents(channelId);
    return interaction.showModal(modal);
  }
}
