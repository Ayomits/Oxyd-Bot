import BaseComponent from "@/abstractions/BaseComponent";
import { ButtonInteraction } from "discord.js";
import { EconomySettingsModel } from "@/db/models/economy/EconomySettingsModel";
import { isEnabled } from "@/libs/embeds-functions/isEnabled";

export class EconomyBaseSettingsToggler extends BaseComponent {
  constructor() {
    super({
      customId: "economytoggler",
      ttl: 600,
      authorOnly: true,
    });
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
