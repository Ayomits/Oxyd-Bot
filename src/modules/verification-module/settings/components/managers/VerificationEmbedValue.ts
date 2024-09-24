import BaseSelectMenuValue from "@/abstractions/BaseSelectMenuValue";
import { VerificationModuleModel } from "@/db/models/verification/VerificationModel";
import { SomethingWentWrong } from "@/errors/SomethingWentWrong";
import { dischookDeParses } from "@/utils/parsers/discohookParser";
import { ModalBuilder } from "@discordjs/builders";
import {
  ActionRowBuilder,
  StringSelectMenuInteraction,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

export class VerificationEmbedManageValue extends BaseSelectMenuValue {
  constructor() {
    super("embed");
  }

  public async execute(
    interaction: StringSelectMenuInteraction,
    _args: string[]
  ) {
    const existed = await VerificationModuleModel.findOne({
      guildId: interaction.guild.id,
    });
    try {
      const modal = new ModalBuilder()
        .setCustomId(`manageEmbedModal`)
        .setTitle(`Управление эмбедами`)
        .addComponents(
          new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
              .setCustomId(`url`)
              .setLabel(`Вставьте ссылку с дискохука`)
              .setPlaceholder(existed.messages.length >= 1 ? await dischookDeParses(existed.messages) : "https://share.discohook.org/go/")
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
          )
        );
      return await interaction.showModal(modal);
    } catch {
      return new SomethingWentWrong(interaction);
    }
  }
}
