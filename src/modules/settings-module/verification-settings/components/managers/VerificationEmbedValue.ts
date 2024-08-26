import BaseSelectMenuValue from "@/abstractions/BaseSelectMenuValue";
import { SomethingWentWrong } from "@/errors/SomethingWentWrong";
import { ModalBuilder } from "@discordjs/builders";
import {
  ActionRowBuilder,
  StringSelectMenuInteraction,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

export class VerificationEmbed extends BaseSelectMenuValue {
  constructor() {
    super("verificationEmbedManage");
  }

  async execute(interaction: StringSelectMenuInteraction, _args: string[]) {
    try {
      const modal = new ModalBuilder()
        .setCustomId(`manageEmbedModal`)
        .setTitle(`Управление эмбедами`)
        .addComponents(
          new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
              .setCustomId(`url`)
              .setLabel(`Вставьте ссылку с дискохука`)
              .setPlaceholder(`https://share.discohook.app/go/8u8sy13p`)
              .setStyle(TextInputStyle.Short)
              .setRequired(false)
          )
        );
      return await interaction.showModal(modal);
    } catch {
      return new SomethingWentWrong(interaction);
    }
  }
}
