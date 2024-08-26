import BaseComponent from "@/abstractions/BaseComponent";
import { SomethingWentWrong } from "@/errors/SomethingWentWrong";
import {
  VerificationModuleDocument,
  VerificationModuleModel,
} from "@/models/VerificationModel";
import { ModalSubmitInteraction, Snowflake, bold } from "discord.js";

export class VerificationSettingsSetterModal extends BaseComponent {
  constructor() {
    super("setterModal", 600);
  }
  async execute(interaction: ModalSubmitInteraction, args?: string[]) {
    try {
      const field = args[0] as keyof VerificationModuleDocument;
      await interaction.deferReply({ ephemeral: true });
      const snowflake = interaction.fields.getField("snowflake")
        ?.value as Snowflake | null;
      const snowflakeEntity =
        field === "channel"
          ? interaction.guild.channels.cache.get(snowflake)
          : interaction.guild.roles.cache.get(snowflake);
      const newVerification = await VerificationModuleModel.findOneAndUpdate(
        { guildId: interaction.guild.id },
        { [field]: snowflakeEntity ? snowflake : null },
        { new: true }
      );
      return interaction.editReply({
        content: `Успешно ${bold(
          `${newVerification[field] ? "установлено" : "сброшено"}`
        )} значение`,
      });
    } catch {
      return new SomethingWentWrong(interaction);
    }
  }
}
