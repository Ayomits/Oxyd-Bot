import BaseEvent from "@/abstractions/BaseEvent";
import { EmbedBuilder, Events, GuildMember } from "discord.js";
import { SnowflakeColors } from "@/enums";
import { discordTimestampFormat } from "@/utils/functions/discordTimestamp";
import { SnowflakeTimestamp } from "@/enums/SnowflkeTimestamp";
import SettingsService from "../interactions/SetupService";

export class GuildMemberAdd extends BaseEvent {
  constructor() {
    super({
      name: Events.GuildMemberRemove,
      once: false,
    });
  }

  async execute(member: GuildMember) {
    const logChannel = await SettingsService.fetchLogChannel(
      member.guild,
      "joins"
    );
    if (!logChannel) return;
    try {
      const embed = new EmbedBuilder()
        .setTitle(`Пользователь присоединился к серверу ${member.guild.name}`)
        .setColor(SnowflakeColors.DEFAULT)
        .setFields(
          {
            name: `> Информация о пользователе`,
            value: `${member.user} | \`${member.user.id}\``,
            inline: true,
          },
          {
            name: `> Дата создания аккаунта`,
            value: `${discordTimestampFormat(
              member.user.createdTimestamp / 1000,
              SnowflakeTimestamp.LONG_DATE_WITH_DAY_OF_WEEK_AND_SHORT_TIME
            )}>`,
            inline: true,
          },
          {
            name: `> Количество участников`,
            value: `${member.guild.memberCount}`,
            inline: true,
          }
        )
        .setFooter({
          text: `${member.user.username} | ${member.user.id}`,
          iconURL: member.user.displayAvatarURL(),
        })
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp(new Date());
      return await logChannel.send({ embeds: [embed] });
    } catch {}
  }
}
