import BaseComponent from "@/abstractions/BaseComponent";
import { VerificationRoleModel } from "@/models/VerificationRoleModel";
import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalBuilder,
  ModalSubmitInteraction,
  roleMention,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

export class VerificationRoleDelete extends BaseComponent {
  constructor() {
    super("verificationrolesdelete", 600);
  }

  async execute(interaction: ButtonInteraction) {
    const modal = new ModalBuilder()
      .setTitle(`Удаление роли верификации`)
      .setCustomId(`verificationroledeletemodal`)
      .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId(`roleId`)
            .setLabel(`Айди роли`)
            .setMaxLength(19)
            .setMinLength(17)
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setPlaceholder(`1268160506623950868`)
        )
      );
    return await interaction.showModal(modal);
  }
}

export class VerificationRoleDeleteModal extends BaseComponent {
  constructor() {
    super("verificationroledeletemodal", 600);
  }

  async execute(interaction: ModalSubmitInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const roleId = interaction.fields.getField("roleId").value as string;
    const existed = await VerificationRoleModel.findOne({
      guildId: interaction.guild.id,
      roleId: roleId,
    });
    if (!existed)
      return interaction.editReply({
        content: `Указанной верификационной роли **не существует**`,
      });
    interaction.editReply({
      content: `Успешно удалена верификационная роль ${roleMention(roleId)}`,
    });
    await existed.deleteOne();
  }
}
