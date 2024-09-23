import BaseSelectMenuValue from "@/abstractions/BaseSelectMenuValue";
import { SnowflakeVerificationRolesLimit } from "@/enums/SnowflakeVerificationRolesLimit";
import { VerificationRoleModel } from "@/db/models/verification/VerificationRoleModel";
import {
  StringSelectMenuInteraction,
  RoleSelectMenuInteraction,
  ChannelSelectMenuInteraction,
  UserSelectMenuInteraction,
  AnySelectMenuInteraction,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

export async function VerificationRolesCreateNewModal(
  roleId?: string
): Promise<ModalBuilder> {
  let roleFromDb;
  if (roleId) {
    roleFromDb = await VerificationRoleModel.findOne({ roleId: roleId });
  }
  const valueOrNot = (key: string) => {
    return roleFromDb ? roleFromDb[key] : undefined; // Возвращаем undefined, если значение не найдено
  };

  const modal = new ModalBuilder()
    .setCustomId(`verificationrolescreatenewmodal${roleId ? `_${roleId}` : ""}`)
    .setTitle(
      `${roleId ? "Обновление" : "Создание новой"} верификационной роли`
    )
    .addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(
        (() => {
          const input = new TextInputBuilder()
            .setCustomId(`roleId`)
            .setLabel(`Айди роли`)
            .setMinLength(17)
            .setMaxLength(19)
            .setPlaceholder(`1268160506623950868`)
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
          if (roleId) input.setValue(valueOrNot("roleId")); // Устанавливаем значение только если roleId существует
          return input;
        })()
      ),
      new ActionRowBuilder<TextInputBuilder>().addComponents(
        (() => {
          const input = new TextInputBuilder()
            .setCustomId(`displayname`)
            .setLabel(`Отображаемое название`)
            .setPlaceholder(`Незнакомец`)
            .setMaxLength(50)
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
          if (roleId) input.setValue(valueOrNot("displayName")); // Устанавливаем значение только если roleId существует
          return input;
        })()
      ),
      new ActionRowBuilder<TextInputBuilder>().addComponents(
        (() => {
          const input = new TextInputBuilder()
            .setCustomId(`style`)
            .setLabel(`Цвет кнопки`)
            .setPlaceholder(`1-синий, 2-серый, 3-зелёный, 4-красный`)
            .setRequired(false)
            .setMinLength(1)
            .setMaxLength(1)
            .setStyle(TextInputStyle.Short);
          if (valueOrNot("style")) input.setValue(String(valueOrNot("style"))); // Устанавливаем значение только если оно существует
          return input;
        })()
      )
    );

  return modal;
}

export class VerificationRolesCreate extends BaseSelectMenuValue {
  constructor() {
    super("createnewrole");
  }

  public async execute(
    interaction: StringSelectMenuInteraction,
    args: string[]
  ): Promise<any> {
    const verificationRoles = await VerificationRoleModel.find({
      guildId: interaction.guild.id,
    });
    if (
      verificationRoles.length + 1 >=
      SnowflakeVerificationRolesLimit.STANDART
    ) {
      return interaction.reply({
        content: `У вашего сервера слишком много верификационных ролей. Удалите 1`,
        ephemeral: true,
      });
    }
    const modal = await VerificationRolesCreateNewModal();
    return await interaction.showModal(modal);
  }
}
