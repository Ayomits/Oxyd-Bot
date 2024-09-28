import BaseComponent from "@/abstractions/BaseComponent";
import { MarrySettingsModel } from "@/db/models/economy/MarrySettingsModel";
import { channelMention, ChannelSelectMenuInteraction } from "discord.js";

export class MarryChannelSelect extends BaseComponent {
  constructor() {
    super({
      customId: "categoryselect",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ChannelSelectMenuInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const value = interaction.values[0];
    interaction.editReply({
      content: `**Успешно** установлена категория для любовных комнат ${channelMention(
        value
      )}`,
    });
    await MarrySettingsModel.updateOne(
      {
        guildId: interaction.guild.id,
      },
      {
        loveroomCategory: value,
      }
    );
  }
}
