import prisma from "@/db/prisma";
import { SnowflakeColors, SnowflakeLanguage } from "@/enums";
import { SnowflakeMentionType } from "@/enums/SnowflakeMentionType";
import { mention } from "@/utils/functions/mentions";
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
  const settings = await prisma.logSettings.findFirst({
    where: { guildId: interaction.guild.id },
    include: { guild: true },
  });
  const embed = new EmbedBuilder()
    .setTitle(`Настройка логгирования ${interaction.guild.name}`)
    .setColor(SnowflakeColors.DEFAULT)
    .setFields(
      {
        name: `> Message logs`,
        value: mention(
          settings.message,
          SnowflakeMentionType.CHANNEL,
          settings.guild.language as SnowflakeLanguage
        ),
        inline: true,
      },
      {
        name: `> Voice logs`,
        value: mention(
          settings.voice,
          SnowflakeMentionType.CHANNEL,
          settings.guild.language as SnowflakeLanguage
        ),
        inline: true,
      },
      {
        name: `> Role actions logs`,
        value: mention(
          settings.roles,
          SnowflakeMentionType.CHANNEL,
          settings.guild.language as SnowflakeLanguage
        ),
        inline: true,
      },
      {
        name: `> Member logs`,
        value: mention(
          settings.members,
          SnowflakeMentionType.CHANNEL,
          settings.guild.language as SnowflakeLanguage
        ),
        inline: false,
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

  const logSelect =
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`logSelect`)
        .setPlaceholder(`Выберите желаемую настройку логов`)
        .setOptions(
          {
            label: `Сообщения`,
            value: `message`,
            description: "Логирование действий над сообщениями",
            emoji: "📩",
          },
          {
            label: `Голосовые каналы`,
            value: "voice",
            description: "Логирование действий в голосовых каналах",
            emoji: "🎤",
          },
          {
            label: `Действия с ролями`,
            value: "roles",
            description: "Логирование действий над ролями",
            emoji: "🎭",
          },
          {
            label: `Участники`,
            value: "members",
            description: "Логирование действий над участниками",
            emoji: "👥",
          }
        )
    );
  return {
    embeds: [embed],
    components: [logSelect, refreshButton],
  };
}
