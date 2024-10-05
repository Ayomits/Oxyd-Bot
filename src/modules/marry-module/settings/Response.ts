import { MarrySettingsModel } from "@/db/models/economy/MarrySettingsModel";
import { SnowflakeColors } from "@/enums";
import { SnowflakeMentionType } from "@/enums/SnowflakeMentionType";
import { buttonStyle } from "@/libs/embeds-functions/buttonStyle";
import { isEnabled } from "@/libs/embeds-functions/isEnabled";
import { mentionOrNot } from "@/libs/embeds-functions/mentions";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  ChannelType,
  CommandInteraction,
  EmbedBuilder,
  roleMention,
  RoleSelectMenuBuilder,
} from "discord.js";

export async function MarrySettingsResponse(
  interaction: ButtonInteraction | CommandInteraction
) {
  const settings =
    (await MarrySettingsModel.findOne({
      guildId: interaction.guild.id,
    })) || (await MarrySettingsModel.create({ guildId: interaction.guild.id }));

  const embed = new EmbedBuilder()
    .setTitle(`Настройка модуля браков`)
    .setColor(SnowflakeColors.DEFAULT)
    .setThumbnail(interaction.user.displayAvatarURL())
    .setFields(
      {
        name: `> Состояние модуля`,
        value: isEnabled(settings.enable),
        inline: false
      },
      {
        name: `> Роль для брака`,
        value: mentionOrNot(settings.marryRole, SnowflakeMentionType.ROLE),
        inline: true
      },
      {
        name: `> Категория любовных комнат`,
        value: mentionOrNot(
          settings.loveroomCategory,
          SnowflakeMentionType.CHANNEL
        ),
        inline: true
      }
    )
    .setTimestamp(new Date());

  const roleSelect =
    new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
      new RoleSelectMenuBuilder()
        .setCustomId(`marryroleselect`)
        .setPlaceholder(`Выберите роль для браков`)
    );

  const categorySelect =
    new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
      new ChannelSelectMenuBuilder()
        .setCustomId(`categoryselect`)
        .setChannelTypes(ChannelType.GuildCategory)
        .setPlaceholder(`Выберите категорию любовных комнат`)
    );

  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`marrysettingsrefreshidkdk`)
      .setStyle(ButtonStyle.Primary)
      .setLabel(`Обновить`),
    new ButtonBuilder()
      .setCustomId(`marrysettingstoggleridkdk`)
      .setStyle(buttonStyle(settings.enable))
      .setLabel(`Включить/Выключить`)
  );
  // Convert ActionRowBuilders to JSON
  return {
    components: [
      roleSelect.toJSON(),
      categorySelect.toJSON(),
      buttons.toJSON(),
    ],
    embeds: [embed],
  };
}
