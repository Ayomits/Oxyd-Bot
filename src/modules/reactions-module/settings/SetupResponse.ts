import { SnowflakeColors } from "@/enums";
import {
  ReactionModuleDocument,
  ReactionModuleModel,
} from "@/db/models/economy/ReactionsModel";
import { buttonStyle } from "@/libs/embeds-functions/buttonStyle";
import { isEnabled } from "@/libs/embeds-functions/isEnabled";
import { snowflakeArraysFilter } from "@/libs/embeds-functions/snowflakeArraysFilter";
import {
  ActionRowBuilder,
  AnySelectMenuInteraction,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  channelMention,
  ChannelSelectMenuBuilder,
  ChannelType,
  CommandInteraction,
  EmbedBuilder,
  Guild,
} from "discord.js";

export async function reactionModuleResponse(
  interaction: CommandInteraction | ButtonInteraction | AnySelectMenuInteraction
) {
  const reactionSettings =
    (await ReactionModuleModel.findOne({
      guildId: interaction.guild.id,
    })) ||
    (await ReactionModuleModel.create({ guildId: interaction.guild.id }));
  const embed = new EmbedBuilder()
    .setTitle(`Настройка модуля реакций`)
    .setFields(
      {
        name: `Состояние модуля`,
        value: `${isEnabled(reactionSettings.enable)}`,
      },
      {
        name: `> Каналы для обычных реакций`,
        value: `${snowflakeArraysFilter(
          reactionSettings.commonReactions,
          interaction.guild,
          "channels"
        )}`,
      },
      {
        name: `> Каналы для nsfw реакций`,
        value: `${snowflakeArraysFilter(
          reactionSettings.nsfwReactions,
          interaction.guild,
          "channels"
        )}`,
      },
      {
        name: `> Использование слеш реакций`,
        value: `${isEnabled(reactionSettings.useSlash)}`,
      },
      {
        name: `> Использование префикс реакций`,
        value: `${isEnabled(reactionSettings.usePrefix)}`,
      }
    )
    .setColor(SnowflakeColors.DEFAULT)
    .setThumbnail(interaction.user.displayAvatarURL())
    .setTimestamp(new Date())
    .setFooter({
      text: interaction.user.globalName,
      iconURL: interaction.user.displayAvatarURL(),
    });
  const buttonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(
        `toggleReactionModule_${interaction.user.id}_${interaction.guild.id}`
      )
      .setLabel(`Включить/Выключить`)
      .setStyle(buttonStyle(reactionSettings.enable)),
    new ButtonBuilder()
      .setCustomId(
        `reactionRefresh_${interaction.user.id}_${interaction.guild.id}`
      )
      .setLabel(`Обновить`)
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(`toggleruse_useSlash`)
      .setLabel(`Слэш реакции`)
      .setStyle(buttonStyle(reactionSettings.useSlash)),
    new ButtonBuilder()
      .setCustomId(`toggleruse_usePrefix`)
      .setLabel(`Слэш реакции`)
      .setStyle(buttonStyle(reactionSettings.usePrefix))
  );
  return {
    embeds: [embed],
    components: [
      generateSelectMenu(
        `commonReactions`,
        reactionSettings,
        interaction.guild,
        interaction.user.id
      ),
      generateSelectMenu(
        `nsfwReactions`,
        reactionSettings,
        interaction.guild,
        interaction.user.id
      ),
      buttonsRow,
    ],
  };
}
function generateSelectMenu(
  field: keyof ReactionModuleDocument,
  settings: ReactionModuleDocument,
  guild: Guild,
  authorId: string
) {
  return new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
    new ChannelSelectMenuBuilder()
      .setCustomId(`setupRolesChannels_${field}_${guild.id}_${authorId}`)
      .setPlaceholder(
        `Выберите каналы для ${
          field.includes("nsfw") ? "nsfw" : "обычных"
        } реакций`
      )
      .setDefaultChannels(
        settings[field].filter((channel) => !!guild.channels.cache.get(channel))
      )
      .setChannelTypes(ChannelType.GuildText)
      .setMinValues(0)
      .setMaxValues(25)
  );
}
