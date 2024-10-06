import {
  TeleportDocument,
  TeleportModel,
} from "@/db/models/teleport/TeleportModel";
import { SnowflakeColors } from "@/enums";
import { SnowflakeMentionType } from "@/enums/SnowflakeMentionType";
import { buttonStyle } from "@/libs/embeds-functions/buttonStyle";
import { isEnabled } from "@/libs/embeds-functions/isEnabled";
import { snowflakeArraysFilter } from "@/libs/embeds-functions/snowflakeArraysFilter";
import {
  ActionRowBuilder,
  bold,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  channelMention,
  ChannelSelectMenuBuilder,
  ChannelType,
  EmbedBuilder,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
} from "discord.js";

export async function TeleportEmbedResponse(
  interaction:
    | ModalSubmitInteraction
    | StringSelectMenuInteraction
    | ButtonInteraction,
  objectId: any
) {
  const teleport = await TeleportModel.findOne({ _id: objectId });
  const embed = new EmbedBuilder()
    .setDescription(`## Настройка телепорта: ${bold(teleport.displayName)}`)
    .setTimestamp(new Date())
    .setThumbnail(interaction.user.displayAvatarURL())
    .setColor(SnowflakeColors.DEFAULT)
    .setFields(
      {
        name: `> Состояние телепорта`,
        value: `${isEnabled(teleport.enable)}`,
      },
      {
        name: `> Триггер канал`,
        value: `${channelMention(teleport.channelId)}`,
        inline: true,
      },
      {
        name: `> Категории перемещения`,
        value: `${snowflakeArraysFilter(
          teleport.categories,
          interaction.guild,
          "channels",
          SnowflakeMentionType.CHANNEL
        )}`,
        inline: true,
      },
      {
        name: `> Каналы перемещения`,
        value: `${snowflakeArraysFilter(
          teleport.channels,
          interaction.guild,
          "channels",
          SnowflakeMentionType.CHANNEL
        )}`,
        inline: true,
      },
      {
        name: `> Игнорируемые каналы перемещения`,
        value: `${snowflakeArraysFilter(
          teleport.ignoredChannels,
          interaction.guild,
          "channels",
          SnowflakeMentionType.CHANNEL
        )}`,
        inline: false,
      }
    );
  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`teleporttoggler_${Math.random()}`)
      .setLabel(`Включить/Выключить`)
      .setStyle(buttonStyle(teleport.enable)),
    new ButtonBuilder()
      .setCustomId(`teleportrename_${Math.random()}`)
      .setLabel(`Сменить название`)
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(`teleportrefresher_${objectId}`)
      .setLabel(`Обновить`)
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(`teleportdeletebutton_${objectId}`)
      .setLabel(`Удалить`)
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId(`teleportbackbuttone_${Math.random()}`)
      .setLabel(`Назад`)
      .setStyle(ButtonStyle.Danger)
  );
  const selectMenu = (
    field: keyof TeleportDocument,
    channelType: ChannelType = ChannelType.GuildText,
    once: boolean = false
  ) => {
    const select = new ChannelSelectMenuBuilder().setChannelTypes(channelType);
    if (once) select.setMaxValues(1);
    else {
      select.setMaxValues(25);

      select.setDefaultChannels(
        teleport[field]
          .filter((channel) => interaction.guild.channels.cache.get(channel))
          .map((channel) => channel)
      );
    }
    select.setCustomId(`tpchsl_${field}_${objectId}_${once}`);
    return new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
      select
    );
  };
  return {
    embeds: [embed],
    components: [
      selectMenu("channelId", ChannelType.GuildVoice, true),
      selectMenu("categories", ChannelType.GuildCategory, false),
      selectMenu("channels", ChannelType.GuildVoice, false),
      selectMenu("ignoredChannels", ChannelType.GuildVoice, false),
      buttons,
    ],
  };
}
