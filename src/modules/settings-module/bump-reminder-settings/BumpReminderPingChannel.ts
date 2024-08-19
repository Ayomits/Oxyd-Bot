import BaseComponent from "@/abstractions/BaseComponent";
import { SomethingWentWrong } from "@/errors/SomethingWentWrong";
import { BumpReminderModuleModel } from "@/models/BumpReminderModel";
import { ChannelSelectMenuInteraction } from "discord.js";

export class BumpReminderPingChannel extends BaseComponent {
  constructor() {
    super("bumpreminderroles", 600);
  }
  async execute(interaction: ChannelSelectMenuInteraction) {
    try {
      await interaction.deferReply();
      await BumpReminderModuleModel.updateOne(
        { guildId: interaction.guild.id },
        { pingChannelId: interaction.values[0] }
      );
      return interaction.editReply({
        content: `Успешно **установлен** канал для пинга`,
      });
    } catch {
      return new SomethingWentWrong(interaction);
    }
  }
}
