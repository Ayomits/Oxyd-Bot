import BaseComponent from "@/abstractions/BaseComponent";
import { SomethingWentWrong } from "@/errors/SomethingWentWrong";
import { VerificationModuleModel } from "@/models/VerificationModel";
import { isEnabled } from "@/utils/functions/isEnabled";
import { ButtonInteraction } from "discord.js";

export class VerificationModuleToggler extends BaseComponent {
  constructor() {
    super("toggleVerificationModule", 600);
  }
  async execute(interaction: ButtonInteraction, args: string[]) {
    try {
      const field = args[0];
      const existed = await VerificationModuleModel.findOne({
        guildId: interaction.guild.id,
      });
      await interaction.deferReply({ ephemeral: true });
      interaction.editReply({
        content: `Опция была переключена в режим **${isEnabled(
          !existed[field]
        ).toLowerCase()}**`,
      });
      await existed.updateOne({
        [field]: !existed[field],
      });
    } catch {
      return new SomethingWentWrong(interaction);
    }
  }
}
