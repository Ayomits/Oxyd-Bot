import BaseComponent from "@/abstractions/BaseComponent";
import { VerificationHelloModel } from "@/db/models/verification/VerificationHelloModel";
import { isEnabled } from "@/utils/functions/isEnabled";
import { ButtonInteraction } from "discord.js";

export class VerifcationHelloToggler extends BaseComponent {
  constructor() {
    super("helloverifcationtoggler", 600);
  }

  async execute(interaction: ButtonInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const existed = await VerificationHelloModel.findOne({
      guildId: interaction.guild.id,
    });
    await existed.updateOne({
      $set: {
        enable: !existed.enable,
      },
    });
    interaction.editReply({
      content: `Модуль приветствий после верификации **успешно** **${isEnabled(
        !existed.enable
      ).toLowerCase()}**`,
    });
  }
}
