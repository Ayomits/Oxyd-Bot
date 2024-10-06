import BaseEvent from "@/abstractions/BaseEvent";
import { TeleportModel } from "@/db/models/teleport/TeleportModel";
import { TeleportSettingsModel } from "@/db/models/teleport/TeleportSettingsModel";
import { randomValue } from "@/libs/embeds-functions/random";
import { ChannelType, Events, VoiceChannel, VoiceState } from "discord.js";

export class TeleportVoiceStateUpdate extends BaseEvent {
  constructor() {
    super({
      name: Events.VoiceStateUpdate,
      once: false,
    });
  }

  async execute(_oldState: VoiceState, newState: VoiceState) {
    if (!newState) return;
    const member = newState.member;
    const channel = newState.channel;

    const [teleportSettings, teleport] = await Promise.all([
      TeleportSettingsModel.findOne({ guildId: newState.guild.id }),
      TeleportModel.findOne({
        guildId: newState.guild.id,
        channelId: channel?.id,
      }),
    ]);
    if (!teleportSettings || !teleport) {
      return;
    }
    if (!teleportSettings.enable || !teleport.enable) {
      return;
    }
    const values = [
      teleport.categories.filter((channel) =>
        newState.guild.channels.cache.get(channel)
      ),
      teleport.channels.filter((channel) => {
        const isIgnored = teleport.ignoredChannels.includes(channel);
        const channelFromGuild = newState.guild.channels.cache.get(channel);
        if (isIgnored && teleport.channels.length > 1) return false;
        if (!channelFromGuild) return false;
        if (!channelFromGuild.isVoiceBased()) return false;
        return true;
      }),
    ].filter((arr) => {
      if (!arr || arr.length <= 0) return false;
      return true;
    });
    const randomArr = randomValue(values);
    const randomArrValue = randomValue(randomArr);
    const randomArrChannel = newState.guild.channels.cache.get(randomArrValue);
    if (randomArrChannel.type === ChannelType.GuildCategory) {
      let randomChannel;
      const channels = newState.guild.channels.cache.filter(
        (channel) =>
          channel.type === ChannelType.GuildVoice &&
          channel.parentId === randomArrChannel.id &&
          !teleport.ignoredChannels.includes(channel.id)
      );
      if (channels.size <= 0) {
        if (values.length >= 2) {
          const arr = values[1];
          if (arr.length <= 0) return;
          randomChannel = newState.guild.channels.cache.get(randomValue(arr));
        }
      }
      randomChannel = channels.random();
      return await member.voice.setChannel(randomChannel);
    } else {
      console.log(randomArr)
      if (teleport.ignoredChannels.includes(randomArrChannel.id))
      {
        if (randomArr.length === 1)
          return await member.voice.setChannel(
            randomArrChannel as VoiceChannel
          );
        else return;
      }
      else {
        return await member.voice.setChannel(randomArrChannel as VoiceChannel);
      }
    }
  }
}
