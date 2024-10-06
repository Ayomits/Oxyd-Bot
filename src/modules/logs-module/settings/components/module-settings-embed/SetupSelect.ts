import BaseComponent from "@/abstractions/BaseComponent";
import { SnowflakeColors } from "@/enums";
import { SetResponseTo } from "@/libs/components-functions/SetResponseTo";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  ChannelType,
  EmbedBuilder,
  ModalBuilder,
  StringSelectMenuInteraction,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { LogChannelSetupResponse } from "../channel-setup-embed/Response";

export class SettingsSelect extends BaseComponent {
  constructor() {
    super({
      customId: "logSelect",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: StringSelectMenuInteraction) {
    await SetResponseTo(interaction, LogChannelSetupResponse)
  }
}
