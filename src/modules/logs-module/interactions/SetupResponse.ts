import { SnowflakeColors, SnowflakeLanguage } from "@/enums";
import { SnowflakeMentionType } from "@/enums/SnowflakeMentionType";
import { LogModuleModel } from "@/models/LogsModel";
import { mentionOrNot } from "@/utils/functions/mentions";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  Guild,
  StringSelectMenuBuilder,
} from "discord.js";

export async function settingsResponse(
  interaction: CommandInteraction | ButtonInteraction
) {
  const settings = await LogModuleModel.findOne({
    guildId: interaction.guild.id,
  });
  const embed = new EmbedBuilder()
    .setTitle(`Настройка логгирования ${interaction.guild.name}`)
    .setColor(SnowflakeColors.DEFAULT)
    .setFields(
      {
        name: `> Логи сообщений`,
        value: mentionOrNot(settings.messages, SnowflakeMentionType.CHANNEL),
        inline: true,
      },
      {
        name: `> Логи голосовых каналов`,
        value: mentionOrNot(settings.voice, SnowflakeMentionType.CHANNEL),
        inline: true,
      },
      {
        name: `> Логи присоединений`,
        value: mentionOrNot(settings.joins, SnowflakeMentionType.CHANNEL),
        inline: true,
      },
      {
        name: `> Логи участников`,
        value: mentionOrNot(settings.members, SnowflakeMentionType.CHANNEL),
        inline: true,
      }
    )
    .setFooter({
      text: interaction.guild.name,
      iconURL: interaction.guild.iconURL() || null,
    })
    .setThumbnail(interaction.user.displayAvatarURL());

  const refreshButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`logsrefresh`)
      .setEmoji("🔃")
      .setStyle(ButtonStyle.Secondary)
  );
  const options = [
    {
      label: `Сообщения`,
      value: `messages`,
      description: "Логирование действий над сообщениями",
      emoji: "📩",
    },
    {
      label: `Голосовые каналы`,
      value: "voice",
      description: "Логирование действий в голосовых каналах",
      emoji: "🎤",
    },
    // {
    //   label: `Действия с ролями`,
    //   value: "roles",
    //   description: "Логирование действий над ролями",
    //   emoji: "🎭",
    // },
    {
      label: `Вход-выход`,
      value: "joins",
      description: "Логирование действий над участниками",
      emoji: "👥",
    },
    {
      label: `Изменения участника`,
      value: `members`,
      description: `Изменение ролей/никнейма/аватара участника`,
      emoji: "🔯",
    },
  ];
  const select = new StringSelectMenuBuilder()
    .setCustomId(`logSelect`)
    .setPlaceholder(`Выберите желаемую настройку логов`)
    .setMinValues(1)
    .setMaxValues(options.length)
    .setOptions(options);
  const logSelectRow =
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);
  return {
    embeds: [embed],
    components: [logSelectRow, refreshButton],
  };
}
