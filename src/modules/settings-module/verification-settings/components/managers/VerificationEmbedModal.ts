import BaseComponent from "@/abstractions/BaseComponent";
import { VerificationModuleModel } from "@/models/VerificationModel";
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
        content: `Сссылка **должна** быть на discohook. Используйте кнопку share!`,
      });
    }
    const response = await fetch(url);
    const endUrl = response.url;
    const base = endUrl.replace("https://discohook.org/?data=", "");
    const decoded = Buffer.from(base, "base64").toString("utf-8");

    const json = JSON.parse(decoded);
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
