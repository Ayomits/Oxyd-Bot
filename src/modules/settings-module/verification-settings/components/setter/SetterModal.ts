import BaseComponent from "@/abstractions/BaseComponent";
import { ChannelTypeError } from "@/errors/ChannelTypeError";
import { SomethingWentWrong } from "@/errors/SomethingWentWrong";
import {
  VerificationModuleDocument,
  VerificationModuleModel,
} from "@/models/VerificationModel";
import {
  ChannelType,
  GuildChannel,
  ModalSubmitInteraction,
  Role,
  Snowflake,
  bold,
} from "discord.js";

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
          ? (interaction.guild.channels.cache.get(snowflake) as GuildChannel)
          : (interaction.guild.roles.cache.get(snowflake) as Role);
      const newVerification = await VerificationModuleModel.findOneAndUpdate(
        { guildId: interaction.guild.id },
        { [field]: snowflakeEntity ? snowflake : null },
        { new: true }
      );
      if (
        field === "channel" &&
        (snowflakeEntity as GuildChannel).type !== ChannelType.GuildText
      )
        return new ChannelTypeError(interaction);
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
