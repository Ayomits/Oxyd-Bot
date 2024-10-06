import BaseComponent from "@/abstractions/BaseComponent";
import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalBuilder,
  ModalSubmitInteraction,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { TeleportEmbedResponse } from "./Response";
import { TeleportModel } from "@/db/models/teleport/TeleportModel";

export class RenameButton extends BaseComponent {
  constructor() {
    super({
      customId: "teleportrename",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ButtonInteraction, args: string[]) {
    const modal = new ModalBuilder()
      .setCustomId(`allteleportsupdatemodal_${args[0]}`)
      .setTitle(`Создание телепорта`)
      .setComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId(`displayname`)
            .setPlaceholder(`loverooms`)
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setLabel(`Название телепорта`)
        )
      );
    return await interaction.showModal(modal);
  }
}

export class CreateTeleportModal extends BaseComponent {
  constructor() {
    super({
      customId: "allteleportsupdatemodal",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ModalSubmitInteraction, args: string[]) {
    try {
      const displayName = interaction.fields.getField("displayname")
        .value as string;
      const teleportDb = await TeleportModel.findByIdAndUpdate(
        { _id: args[0] },
        {
          displayName,
        },
        { new: true }
      );

      await interaction.deferUpdate();
      interaction.editReply(
        await TeleportEmbedResponse(interaction, teleportDb._id)
      );
    } catch {}
  }
}
