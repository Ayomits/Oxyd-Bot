import BaseComponent from "@/abstractions/BaseComponent";
import { ChannelType, ModalSubmitInteraction, Snowflake } from "discord.js";
import { ChannelDoesNotExists } from "@/errors/ChannelDoesNotExists";
import { ChannelTypeError } from "@/errors/ChannelTypeError";
import { LogModuleModel } from "@/db/models/logging/LogsModel";


export class SettingsModal extends BaseComponent {
  constructor() {
    super("settingsModal", 600);
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
      LogModuleModel.updateOne(
        { guildId: interaction.guildId },
        {
          ...query,
        }
      ),
      interaction.editReply({
        content: `Успешно **${
          channelId ? "установлена" : "сброшена"
        }** настройка`,
      }),
    ]);
  }
}
