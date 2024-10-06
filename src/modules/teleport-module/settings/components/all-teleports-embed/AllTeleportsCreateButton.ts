import BaseComponent from "@/abstractions/BaseComponent";
import { TeleportModel } from "@/db/models/teleport/TeleportModel";
import {
  ActionRowBuilder,
  ModalBuilder,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { TeleportEmbedResponse } from "../teleport-embed/Response";
import BaseSelectMenuValue from "@/abstractions/BaseSelectMenuValue";

export class CreateTeleportValue extends BaseSelectMenuValue {
  constructor() {
    super("teleportcreate");
  }

  async execute(interaction: StringSelectMenuInteraction) {
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
