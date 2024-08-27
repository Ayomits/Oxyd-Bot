import BaseComponent from "@/abstractions/BaseComponent";
import { VerificationModuleModel } from "@/models/VerificationModel";
import { discohookParser } from "@/utils/parsers/discohookParser";
import { ModalSubmitInteraction } from "discord.js";

export class VerificationSettingsEmbedModal extends BaseComponent {
  constructor() {
    super("manageEmbedModal", 600);
  }
  async execute(interaction: ModalSubmitInteraction, args?: string[]) {
    await interaction.deferReply({ ephemeral: true });
    const url = interaction.fields.getField("url")?.value as string;
    const shareCondition = url.includes("https://share.discohook.app");
    if (!shareCondition) {
      return interaction.editReply({
        content: `Сссылка **должна** быть на discohook. Используйте кнопку share на сайте!`,
      });
    }
    const json = await discohookParser(url)
    await VerificationModuleModel.updateOne(
      {
        guildId: interaction.guild.id,
      },
      {
        $set: {
          messages: json.messages,
        },
      }
    );
    return interaction.editReply({ content: `Эмбед **успешно** установлен` });
  }
}
