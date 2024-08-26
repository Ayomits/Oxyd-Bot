import { SnowflakeColors } from "@/enums";
import { SomethingWentWrong } from "@/errors/SomethingWentWrong";
import { VerificationRoleModel } from "@/models/VerificationRoleModel";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
  roleMention,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  StringSelectMenuOptionBuilder,
} from "discord.js";

export async function verificationRolesResponse(
  interaction: StringSelectMenuInteraction | ButtonInteraction
) {
  const embed = new EmbedBuilder()
    .setTitle(`Настройка верификационных ролей`)
    .setColor(SnowflakeColors.DEFAULT)
    .setThumbnail(interaction.user.displayAvatarURL());

  const verificationRoles = await VerificationRoleModel.find({
    guildId: interaction.guild.id,
  });
  let description = "";
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId(`verificationRolesSelect`)
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel(`Создать новую роль`)
        .setValue(`createnewrole`)
    );
  for (let i = 0; i < verificationRoles.length; i++) {
    const verificationRole = verificationRoles[i];
    const { roleId, displayName, style } = verificationRole;
    selectMenu.addOptions(
      new StringSelectMenuOptionBuilder()
        .setValue(`update_${roleId}`)
        .setLabel(displayName)
    );
    description += `**${i + 1})** ${roleMention(
      roleId
    )}\Отображаемое название: ${displayName}\nСтиль: ${style}`;
  }
  const selectMenuRow =
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);
  const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`verificationrolesgoback`)
      .setLabel(`Назад`)
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId(`verificationrolesrefresh`)
      .setLabel(`Обновить`)
      .setStyle(ButtonStyle.Primary)
  );
  return { embeds: [embed], components: [selectMenuRow, buttonRow] };
}
