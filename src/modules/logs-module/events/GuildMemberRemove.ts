import BaseEvent from "@/abstractions/BaseEvent";
import SettingsService from "../commands/SettingsService";
import { EmbedBuilder, Events, GuildMember, TextChannel } from "discord.js";
import { SnowflakeColors } from "@/enums";
import { discordTimestampFormat } from "@/utils/functions/discordTimestamp";
import { SnowflakeTimestamp } from "@/enums/SnowflkeTimestamp";

export class GuildMemberAdd extends BaseEvent {
  constructor() {
    super({
      name: Events.GuildMemberAdd,
      once: false,
    });
  }

  async execute(member: GuildMember) {
    const { joins } = await SettingsService.findOne(member.guild.id);
    const logChannel = (await member.guild.channels.fetch(
      joins,
      {cache: true}
    )) as TextChannel;
    if (!logChannel) return;
    try {
      const embed = new EmbedBuilder()
        .setTitle(`Пользователь покинул сервер ${member.guild.name}`)
        .setColor(SnowflakeColors.DEFAULT)
        .setFields(
          {
            name: `> Информация о пользователе`,
            value: `${member.user} | \`${member.user.id}\``,
            inline: true,
          },
          {
            name: `> Дата присоединения на сервер`,
            value: `${discordTimestampFormat(
              member.joinedTimestamp / 1000,
              SnowflakeTimestamp.LONG_DATE_WITH_DAY_OF_WEEK_AND_SHORT_TIME
            )}>`,
            inline: true,
          },
          {
            name: `> Количество участников`,
            value: `\`${member.guild.memberCount}\``,
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
