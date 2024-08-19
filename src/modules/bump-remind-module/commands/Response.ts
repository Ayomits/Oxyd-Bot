import { BumpReminderModuleModel } from "@/models/BumpReminderModel";
import {
  ActionRowBuilder,
  bold,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  Guild,
  GuildMember,
} from "discord.js";
import { MonitoringBots } from "./MonitoringBots";
import { discordTimestampFormat } from "@/utils/functions/discordTimestamp";
import { SnowflakeTimestamp } from "@/enums/SnowflkeTimestamp";
import { fetchSafe } from "@/utils/functions/fetchSafe";
import { SnowflakeColors } from "@/enums";

export async function bumpReminderStatusResponse(
  interaction: ButtonInteraction | CommandInteraction
) {
  const bumpSettings = await BumpReminderModuleModel.findOne({
    guildId: interaction.guild.id,
  });
  const sdc = await fetchSafe(MonitoringBots.SDC_MONITORING, interaction.guild);
  const dsmonitoring = await fetchSafe(
    MonitoringBots.DISCORD_MONITORING,
    interaction.guild
  );
  const server_monitoring = await fetchSafe(
    MonitoringBots.SERVER_MONITORING,
    interaction.guild
  );
  const embed = new EmbedBuilder()
    .setTitle(`Статус мониторингов ботов`)
    .setThumbnail(interaction.user.displayAvatarURL())
    .setTimestamp(new Date())
    .setFooter({
      text: interaction.user.globalName,
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setColor(SnowflakeColors.DEFAULT)
    .setFields(
      {
        name: `> SDC Monitoring (/bump)`,
        value: `${hasMonitoringOrNot(sdc, bumpSettings.sdc?.next)}`,
        inline: true,
      },
      {
        name: `> Server Monitoring (/up)`,
        value: `${hasMonitoringOrNot(
          server_monitoring,
          bumpSettings?.serverMonitoring?.next
        )}`,
        inline: true,
      },
      {
        name: `> Discord Monitoring (/like)`,
        value: `${hasMonitoringOrNot(
          dsmonitoring,
          bumpSettings?.serverMonitoring?.next
        )}`,
        inline: true,
      }
    );
  const refreshButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`bumpreminderstaturefresh_${interaction.user.id}`)
      .setLabel(`Обновить`)
      .setStyle(ButtonStyle.Secondary)
  );
  return { embeds: [embed], components: [refreshButton] };
}

function hasMonitoringOrNot(
  member: GuildMember | null,
  timestamp: Date | null
) {
  if (!member) return bold("Мониторинг не подключен");
  if (!timestamp) return bold("Не использована ни одна команда мониторинга");
  return discordTimestampFormat(
    timestamp.getTime() / 1000,
    SnowflakeTimestamp.RELATIVE
  );
}
