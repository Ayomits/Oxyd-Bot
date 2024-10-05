import BaseComponent from "@/abstractions/BaseComponent";
import { MarrySettingsModel } from "@/db/models/economy/MarrySettingsModel";
import { isEnabled } from "@/libs/embeds-functions/isEnabled";
import { ButtonInteraction } from "discord.js";

export class MarrySettingsToggler extends BaseComponent {
  constructor() {
    super({
      customId: "marrysettingstoggleridkdk",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ButtonInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const settings = await MarrySettingsModel.findOne({
      guildId: interaction.guild.id,
    });
    const { enable } = settings;
    console.log(enable, !enable);
    await MarrySettingsModel.updateOne(
      { guildId: interaction.guild.id },
      {
        $set: {
          enable: enable ? !enable : true,
        },
      }
    );
    interaction.editReply({
      content: `Модуль браков **успешно ${isEnabled(!enable).toLowerCase()}**`,
    });
  }
}
