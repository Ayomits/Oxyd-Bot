import { SnowflakeColors } from "@/enums";
import {
  ReactionModuleDocument,
  ReactionModuleModel,
} from "@/models/reactions.model";
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
        value: `${reactionSettings.enable ? "Включен" : "Выключен"}`,
      },
      {
        name: `> Каналы для обычных реакций`,
        value: `${
          reactionSettings.commonReactions.length >= 1
            ? reactionSettings.commonReactions
                .map((channel) => channelMention(channel))
                .join(" ")
            : "Нет"
        }`,
      },
      {
        name: `> Каналы для nsfw реакций`,
        value: `${
          reactionSettings.nsfwReactions.length >= 1
            ? reactionSettings.nsfwReactions
                .map((channel) => channelMention(channel))
                .join(" ")
            : "Нет"
        }`,
      }
    )
    .setColor(SnowflakeColors.DEFAULT)
    .setThumbnail(interaction.guild.iconURL())
    .setTimestamp(new Date())
    .setFooter({
      text: interaction.user.globalName,
      iconURL: interaction.user.displayAvatarURL(),
    });
  const buttonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`toggleReactionModule_${interaction.user.id}_${interaction.guild.id}_${reactionSettings.enable}`)
      .setLabel(`Включить/Выключить`)
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(
        `reactionRefresh_${interaction.user.id}_${interaction.guild.id}`
      )
      .setLabel(`Обновить`)
      .setStyle(ButtonStyle.Secondary)
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
      .setMinValues(1)
      .setMaxValues(25)
  );
}
