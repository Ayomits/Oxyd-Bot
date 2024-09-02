import BaseSelectMenuValue from "@/abstractions/BaseSelectMenuValue";
import { SomethingWentWrong } from "@/errors/SomethingWentWrong";
import { VerificationModuleDocument } from "@/db/models/verification/VerificationModel";
import Logger from "@/utils/system/Logger";
import {
  StringSelectMenuInteraction,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

export class VericiationSettingsSetter extends BaseSelectMenuValue {
  constructor() {
    super("setter");
  }

  public async execute(
    interaction: StringSelectMenuInteraction,
    args: string[]
  ): Promise<any> {
    try {
      const field = args[0] as keyof VerificationModuleDocument;
      const modal = new ModalBuilder()
        .setCustomId(`setterModal_${field}`)
        .setTitle(`Настройка модуля верификации`)
        .addComponents(
          new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
              .setCustomId(`snowflake`)
              .setLabel(`Введите айди`)
              .setPlaceholder(`1273289787771715649`)
              .setStyle(TextInputStyle.Short)
              .setRequired(false)
          )
        );
      return await interaction.showModal(modal);
    } catch (err) {
      Logger.error(err);
      return new SomethingWentWrong(interaction);
    }
  }
}
