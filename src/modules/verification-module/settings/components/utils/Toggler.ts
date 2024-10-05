import BaseComponent from "@/abstractions/BaseComponent";
import { SomethingWentWrong } from "@/errors/SomethingWentWrong";
import { VerificationModuleModel } from "@/db/models/verification/VerificationModel";
import { isEnabled } from "@/libs/embeds-functions/isEnabled";
import { ButtonInteraction } from "discord.js";

export class VerificationModuleToggler extends BaseComponent {
  constructor() {
    super({
      customId: "toggleVerificationModule",
      ttl: 600,
      authorOnly: true,
    });
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
        $set: {
          [field]: existed[field] ? !existed[field] : true,
        },
      });
    } catch {
      return new SomethingWentWrong(interaction);
    }
  }
}
