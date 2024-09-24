import BaseComponent from "@/abstractions/BaseComponent";
import { VerificationHelloModel } from "@/db/models/verification/VerificationHelloModel";
import { channelMention, ChannelSelectMenuInteraction } from "discord.js";

export class VerificationHelloChannelSelect extends BaseComponent {
  constructor() {
    super("helloverifcationchannelselect", 600);
  }

  async execute(interaction: ChannelSelectMenuInteraction, _args?: string[]) {
    await interaction.deferReply({ ephemeral: true });
    const value = interaction.values[0];
    await VerificationHelloModel.updateOne(
      { guildId: interaction.guild.id },
      { channelId: value }
    );
    return interaction.editReply({
      content: `Успешно установлен канал: ${channelMention(value)}`,
    });
  }
}
