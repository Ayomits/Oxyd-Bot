import BaseComponent from "@/abstractions/BaseComponent";
import { VerificationRoleModel } from "@/models/VerificationRoleModel";
import { ButtonStyle, ModalSubmitInteraction } from "discord.js";

export class RoleInteractionModal extends BaseComponent {
  constructor() {
    super("verificationrolescreatenewmodal", 600);
  }

  async execute(interaction: ModalSubmitInteraction, args?: string[]) {
    await interaction.deferReply({ ephemeral: true });
    const argsRoleId = args[0];
    const optionsRoleId = interaction.fields.getField("roleId").value as string;
    const optionsDisplayName = interaction.fields.getField("displayname")
      .value as string;
    const optionsStyle = interaction.fields.getField("style").value as string;
    // Validation checks
    const role = interaction.guild.roles.cache.get(optionsRoleId);
    if (!role)
      return interaction.editReply({
        content: `Указанной роли **не существует**`,
      });
    if (Number.isNaN(optionsStyle))
      return interaction.editReply({
        content: `Указанный Вами стиль не является числом`,
      });
    if (Number(optionsStyle) > ButtonStyle.Danger)
      return interaction.editReply({
        content: `Указанный вами цвет **не существует**.\n 1-синий\n 2-серый\n3-зелёный\n4-красный`,
      });
    // Db actions
    interaction.editReply({
      content: `Успешно **${
        argsRoleId ? "обновлена" : "создана"
      }** верификационная роль ${role} с отображаемым именем **${optionsDisplayName}**`,
    });
    const query = {
      roleId: optionsRoleId,
      displayName: optionsDisplayName,
      style: Number(optionsStyle),
    };
    if (argsRoleId) {
      await VerificationRoleModel.updateOne(
        { roleId: argsRoleId },
        { ...query }
      );
    } else {
      await VerificationRoleModel.create({
        guildId: interaction.guild.id,
        ...query,
      });
    }
  }
}
