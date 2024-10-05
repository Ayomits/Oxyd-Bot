import { BumpReminderModuleModel } from "@/db/models/bump-reminder/BumpReminderModel";
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
import { MonitoringBots } from "../MonitoringBots";
import { discordTimestampFormat } from "@/libs/embeds-functions/discordTimestamp";
import { SnowflakeTimestamp } from "@/enums/SnowflkeTimestamp";
import { fetchSafe } from "@/libs/embeds-functions/fetchSafe";
import { SnowflakeColors } from "@/enums";

export async function bumpReminderStatusResponse(
  interaction: ButtonInteraction | CommandInteraction
) {
  const embed = new EmbedBuilder()
    .setTitle(`Статус мониторингов ботов`)
    .setThumbnail(interaction.user.displayAvatarURL())
    .setTimestamp(new Date())
    .setFooter({
      text: interaction.user.globalName,
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setColor(SnowflakeColors.DEFAULT);
  const bumpSettings =
    (await BumpReminderModuleModel.findOne({
      guildId: interaction.guild.id,
    })) ||
    (await BumpReminderModuleModel.create({ guildId: interaction.guild.id }));
  if (!bumpSettings.enable)
    return {
      embeds: [
        embed.setDescription(
          `Модуль не включен. Используйте \`/bump-settings\` для включения`
        ),
      ],
    };
  const sdc = await fetchSafe(MonitoringBots.SDC_MONITORING, interaction.guild);
  const dsmonitoring = await fetchSafe(
    MonitoringBots.DISCORD_MONITORING,
    interaction.guild
  );
  const server_monitoring = await fetchSafe(
    MonitoringBots.SERVER_MONITORING,
    interaction.guild
  );

  embed.setFields(
    {
      name: `> SDC Monitoring (/up)`,
      value: `${hasMonitoringOrNot(sdc, bumpSettings.sdc?.next)}`,
      inline: true,
    },
    {
      name: `> Server Monitoring (/bump)`,
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
        bumpSettings?.discordMonitoring?.next
      )}`,
      inline: true,
    }
  );
  const refreshButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`bumpreminderstaturefresh_${interaction.user.id}`)
      .setLabel(`Обновить`)
      .setStyle(ButtonStyle.Primary)
  );
  return { embeds: [embed], components: [refreshButton] };
}

function hasMonitoringOrNot(
  member: GuildMember | null,
  timestamp: Date | null
) {
  if (!member) return bold("```Мониторинг не подключен```");
  if (!timestamp) return bold("```Не использована ни одна команда мониторинга```");
  return discordTimestampFormat(
    timestamp.getTime() / 1000,
    SnowflakeTimestamp.RELATIVE
  );
}
