import BaseComponent from "@/abstractions/BaseComponent";
import { ChannelType, ModalSubmitInteraction, Snowflake } from "discord.js";
import SettingsService from "../SettingsService";
import { ChannelDoesNotExists } from "@/errors/ChannelDoesNotExists";
import { ChannelTypeError } from "@/errors/ChannelTypeError";

export class SettingsModal extends BaseComponent {
  constructor() {
    super("settingsModal");
  }
  async execute(interaction: ModalSubmitInteraction, args: string[]) {
    await interaction.deferReply({ ephemeral: true });
    const channelId = interaction.fields.getField("channelId")
      .value as Snowflake;

    const existedChannel = interaction.guild.channels.cache.get(channelId);
    if (channelId && !existedChannel)
      return new ChannelDoesNotExists(interaction);
    if (existedChannel && !existedChannel?.isTextBased())
      return new ChannelTypeError(interaction);
    const query = {};
    args.forEach((arg) => (query[arg] = channelId ? channelId : null));
    return await Promise.all([
      SettingsService.update(interaction.guildId, {
        ...query,
      }),
      interaction.editReply({
        content: `Успешно **${
          channelId ? "установлена" : "сброшена"
        }** настройка`,
      }),
    ]);
  }
}
