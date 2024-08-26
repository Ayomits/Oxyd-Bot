import BaseComponent from "@/abstractions/BaseComponent";
import { SomethingWentWrong } from "@/errors/SomethingWentWrong";
import { VerificationModuleModel } from "@/models/VerificationModel";
import { isEnabled } from "@/utils/functions/isEnabled";
import { ButtonInteraction } from "discord.js";

export class VerificationModuleToggler extends BaseComponent {
  constructor() {
    super("toggleVerificationModule", 600);
  }
  async execute(interaction: ButtonInteraction) {
    try {
      const existed = await VerificationModuleModel.findOne({
        guildId: interaction.guild.id,
      });
      interaction.editReply({
        content: `Модуль верификации **успешно** ${isEnabled(
          !existed.enable
        ).toLowerCase()}`,
      });
      await existed.updateOne({
        enable: !existed.enable,
      });
    } catch {
      return new SomethingWentWrong(interaction);
    }
  }
}
