import BaseSelectMenuValue from "@/abstractions/BaseSelectMenuValue";
import { SnowflakeVerificationRolesLimit } from "@/enums/SnowflakeVerificationRolesLimit";
import { VerificationRoleModel } from "@/models/VerificationRoleModel";
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

export function VerificationRolesCreateNewModal(roleId: string) {
  const modal = new ModalBuilder()
    .setCustomId(`verificationrolescreatenewmodal${roleId ? `_${roleId}` : ""}`)
    .setTitle(`Создание новой верификационной роли`)
    .addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId(`roleId`)
          .setLabel(`Айди роли`)
          .setPlaceholder(`1268160506623950868`)
          .setRequired(true)
          .setStyle(TextInputStyle.Short)
          .setValue(null)
      )
    );
}

export class VerificationRolesCreateNew extends BaseSelectMenuValue {
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
      });
    }
  }
}
