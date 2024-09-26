import BaseComponent from "@/abstractions/BaseComponent";
import { ButtonInteraction } from "discord.js";
import { EconomySettingsModel } from "@/db/models/economy/EconomySettingsModel";
import { isEnabled } from "@/utils/functions/isEnabled";

export class EconomyBaseSettingsToggler extends BaseComponent {
  constructor() {
    super("economytoggler", 600);
  }

  async execute(interaction: ButtonInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const existed = await EconomySettingsModel.findOne({
      guildId: interaction.guild.id,
    });
    await existed.updateOne({
      enable: !existed.enable,
    });
    return interaction.editReply({
      content: `Модуль успешно **${isEnabled(!existed.enable).toLowerCase()}**`,
    });
  }
}
