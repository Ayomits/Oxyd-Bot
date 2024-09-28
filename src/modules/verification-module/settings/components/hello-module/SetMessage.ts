import BaseComponent from "@/abstractions/BaseComponent";
import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { VerificationHelloResponse } from "./Response";

export class VerificationHelloSetMessage extends BaseComponent {
  constructor() {
    super({
      customId: "helloverifcationsetmessage",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ButtonInteraction) {
    const modal = new ModalBuilder()
      .setTitle(`Установка вебхука для приветствий`)
      .setCustomId(`verificationhellomodal`)
      .setComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId(`discohookEmbed`)
            .setLabel(`Ссылка на дискохук`)
            .setPlaceholder(`share.discohook.org`)
            .setStyle(TextInputStyle.Short)
        )
      );
    interaction.showModal(modal);
  }
}
