import BaseComponent from "@/abstractions/BaseComponent";
import { discohookParser } from "@/libs/parsers-functions/discohookParser";
import { VerificationHelloModel } from "@/db/models/verification/VerificationHelloModel";
import { ModalSubmitInteraction } from "discord.js";

export class VerificationHelloSetMessageModal extends BaseComponent {
  constructor() {
    super({
      customId: "verificationhellomodal", 
      ttl: 600,
      authorOnly: true
    });
  }

  async execute(interaction: ModalSubmitInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const field = interaction.fields.getField("discohookEmbed").value;
    const validation = await discohookParser(field);
    if (!validation)
      return interaction.editReply({ content: `Невалидная дискохук ссылка` });
    await VerificationHelloModel.updateOne(
      { guildId: interaction.guild.id },
      {
        message: validation,
      }
    );
    return interaction.editReply({ content: `Успешно установлен вебхук!` });
  }
}
