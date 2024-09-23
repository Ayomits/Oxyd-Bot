import BaseEvent from "@/abstractions/BaseEvent";
import { EmbedBuilder, Events, TextChannel, VoiceState } from "discord.js";
import SettingsService from "../settings/SetupService";
import { SnowflakeColors } from "@/enums";
import Logger from "@/utils/system/Logger";

export class VoiceStateUpdate extends BaseEvent {
  constructor() {
    super({
      name: Events.VoiceStateUpdate,
      once: false,
    });
  }
  async execute(oldState: VoiceState, newState: VoiceState) {
    try {
      const member = newState.member;
      const settings = await SettingsService.findOne(newState.guild.id);
      if (!settings) return;
      const { voice, enable } = settings;
      if (!enable) return;
      const logChannel = (await newState.guild.channels.fetch(voice, {
        cache: true,
      })) as TextChannel;
      if (!logChannel) return;
      const embed = new EmbedBuilder()
        .setColor(SnowflakeColors.DEFAULT)
        .setTimestamp(new Date())
        .setFooter({
          text: `${member.user.globalName} | ${member.user.id}`,
          iconURL: member.displayAvatarURL(),
        });
      // connection
      if (!oldState.channel) {
        embed
          .setTitle(`Пользователь зашёл в голосовой канал`)
          .setDescription(
            `Пользователь ${member} зашёл в голосовой канал ${newState.channel}`
          )
          .setThumbnail(member.displayAvatarURL());
        Logger.log(
          `User connect voice channel (userId: ${member.id}, guildId: ${newState.guild.id}, channelId: ${newState.channel.id})`
        );
        return logChannel.send({ embeds: [embed] });
      }
      // Moved
      if (
        newState.channel &&
        oldState.channel &&
        oldState.channel.id !== newState.channel.id
      ) {
        embed
          .setTitle(`Переход в другой канал`)
          .setDescription(
            `Пользователь ${member} перешёл в ${newState.channel} из ${oldState.channel}`
          )
          .setThumbnail(member.displayAvatarURL());
        Logger.log(
          `User change voice channel (userId: ${member.id}, guildId: ${newState.guild.id}, oldChannelId: ${oldState.channel.id}, newChannelId: ${newState.channel.id})`
        );
        return logChannel.send({ embeds: [embed] });
      }
      // Leave
      if (!newState.channel) {
        embed
          .setTitle(`Пользователь покинул голосовой канал`)
          .setDescription(
            `Пользователь ${member} покинул голосовой канал ${oldState.channel}`
          )
          .setThumbnail(member.displayAvatarURL());
        Logger.log(
          `User disconnect from voice channel (userId: ${member.id}, guildId: ${oldState.guild.id}, channelId: ${oldState.channel.id})`
        );
        return logChannel.send({ embeds: [embed] });
      }
      try {
      } catch (err) {
        Logger.error(err);
      }
    } catch (err) {
      Logger.error(err);
    }
  }
}
