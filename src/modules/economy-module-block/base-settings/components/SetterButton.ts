import BaseComponent from "@/abstractions/BaseComponent";
import { EconomySettingsModel } from "@/db/models/economy/EconomySettingsModel";
import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalBuilder,
  ModalSubmitInteraction,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

export class EconomyBaseSettingsSetterButton extends BaseComponent {
  constructor() {
    super({
      customId: "economysetter",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ButtonInteraction, args: string[]) {
    const field = args[0];
    const modal = new ModalBuilder()
      .setCustomId(`economysettermodal_${field}`)
      .setTitle(`Установка количества валюты`)
      .setComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId(`rate`)
            .setLabel(`Количество валюты`)
            .setPlaceholder(`Введите значение`)
            .setStyle(TextInputStyle.Short)
        )
      );
    return interaction.showModal(modal);
  }
}

export class EconomyBaseSettingsSetterModal extends BaseComponent {
  constructor() {
    super({
      customId: "economysettermodal",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ModalSubmitInteraction, args: string[]) {
    await interaction.deferReply({ ephemeral: true });
    const field = args[0];
    const value = interaction.fields.getField("rate").value;
    if (Number.isNaN(Number(value)))
      return interaction.editReply({
        content: `Указанное значение **не** является числом`,
      });
    await EconomySettingsModel.updateOne(
      { guildId: interaction.guild.id },
      {
        [field]: Number(value),
      }
    );
    return interaction.editReply({
      content: `Значение успешно **установлено**`,
    });
  }
}
