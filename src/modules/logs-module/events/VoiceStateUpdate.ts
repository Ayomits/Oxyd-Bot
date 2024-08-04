import BaseEvent from "@/abstractions/BaseEvent";
import {
  AuditLogEvent,
  EmbedBuilder,
  Events,
  TextChannel,
  VoiceState,
} from "discord.js";
import SettingsService from "../commands/SettingsService";
import { SnowflakeColors } from "@/enums";
import { mention } from "@/utils/functions/mentions";
import { SnowflakeMentionType } from "@/enums/SnowflakeMentionType";
import Logger from "@/utils/system/Logger";

export class VoiceStateUpdate extends BaseEvent {
  constructor() {
    super({
      name: Events.VoiceStateUpdate,
      once: false,
    });
  }
  async execute(oldState: VoiceState, newState: VoiceState) {
    const member = newState.member;
    const { voice } = await SettingsService.findOne(newState.guild.id);
    const logChannel = newState.guild.channels.cache.get(voice) as TextChannel;
    const embed = new EmbedBuilder()
      .setColor(SnowflakeColors.DEFAULT)
      .setTimestamp(new Date())
      .setFooter({
        text: `${member.user.globalName} | ${member.user.id}`,
        iconURL: member.displayAvatarURL(),
      });
    if (!logChannel) return;
    // connection
    if (newState.channel) {
      embed
        .setTitle(`Пользователь зашёл в голосовой канал`)
        .setDescription(
          `Пользователь ${member} зашёл в голосовой канал ${newState.channel}`
        )
        .setThumbnail(member.displayAvatarURL());
      Logger.log(
        `User connect voice channel (userId: ${member.id}, guildId: ${newState.guild.id}, channelId: ${newState.channel.id})`
      );
    }
    // Moved
    if (newState.channel && oldState.channel) {
      embed
        .setTitle(`Переход в другой канал`)
        .setDescription(
          `Пользователь ${member} перешёл в ${newState.channel} из ${oldState.channel}`
        )
        .setThumbnail(member.displayAvatarURL());
      Logger.log(
        `User change voice channel (userId: ${member.id}, guildId: ${newState.guild.id}, oldChannelId: ${oldState.channel.id}, newChannelId: ${newState.channel.id})`
      );
    }
    // Leave
    if (oldState.channel && !newState.channel) {
      embed
        .setTitle(`Пользователь покинул голосовой канал`)
        .setDescription(
          `Пользователь ${member} покинул голосовой канал ${oldState.channel}`
        )
        .setThumbnail(member.displayAvatarURL());
      Logger.log(
        `User disconnect from voice channel (userId: ${member.id}, guildId: ${oldState.guild.id}, channelId: ${oldState.channel.id})`
      );
    }
    return logChannel.send({ embeds: [embed] });
  }
}
