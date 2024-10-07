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

    const { member, channel, guild } = newState;
    if (!member || !channel) return;

    const [teleportSettings, teleport] = await Promise.all([
      TeleportSettingsModel.findOne({ guildId: guild.id }),
      TeleportModel.findOne({ guildId: guild.id, channelId: channel.id }),
    ]);

    if (!teleportSettings?.enable || !teleport?.enable) return;

    const availableChannels = teleport.channels.filter((ch) => {
      const guildChannel = guild.channels.cache.get(ch);
      return (
        guildChannel?.isVoiceBased() && !teleport.ignoredChannels.includes(ch)
      );
    });

    const availableCategories = teleport.categories.filter((category) =>
      guild.channels.cache.has(category)
    );

    const randomArr = randomValue(
      [availableCategories, availableChannels].filter((arr) => arr.length > 0)
    );
    const randomChannelId = randomValue(randomArr);
    const randomChannel = guild.channels.cache.get(randomChannelId);

    if (!randomChannel) return;

    if (randomChannel.type === ChannelType.GuildCategory) {
      const channels = guild.channels.cache.filter(
        (ch) =>
          ch.type === ChannelType.GuildVoice &&
          ch.parentId === randomChannel.id &&
          !teleport.ignoredChannels.includes(ch.id)
      );

      const targetChannel =
        channels.random() ??
        guild.channels.cache.get(randomValue(availableChannels));
      if (targetChannel)
        await member.voice.setChannel(targetChannel as VoiceChannel);
    } else if (!teleport.ignoredChannels.includes(randomChannel.id)) {
      await member.voice.setChannel(randomChannel as VoiceChannel);
    }
  }
}
