import BaseComponent from "@/abstractions/BaseComponent";
import { TeleportModel } from "@/db/models/teleport/TeleportModel";
import { SetResponseTo } from "@/libs/components-functions/SetResponseTo";
import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalBuilder,
  ModalSubmitInteraction,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { TeleportEmbedResponse } from "../teleport-embed/Response";

export class CreateTeleportButton extends BaseComponent {
  constructor() {
    super({
      customId: "teleportcreate",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ButtonInteraction) {
    try {
      const modal = new ModalBuilder()
        .setCustomId(`allteleportscreatemodal`)
        .setTitle(`Создание телепорта`)
        .setComponents(
          new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
              .setCustomId(`displayname`)
              .setPlaceholder(`privateroom`)
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
              .setLabel(`Название телепорта`)
          )
        );
      return await interaction.showModal(modal);
    } catch {}
  }
}

export class CreateTeleportModal extends BaseComponent {
  constructor() {
    super({
      customId: "allteleportscreatemodal",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ModalSubmitInteraction) {
    try {
      const displayName = interaction.fields.getField("displayname")
        .value as string;
      const teleportDb = await TeleportModel.create({
        guildId: interaction.guild.id,
        displayName,
      });

      // TODO: set response function
      await interaction.deferUpdate();
      interaction.editReply(
        await TeleportEmbedResponse(interaction, teleportDb._id)
      );
    } catch {}
  }
}
