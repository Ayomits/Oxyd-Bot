import BaseComponent from "@/abstractions/BaseComponent";
import { MarrySettingsModel } from "@/db/models/economy/MarrySettingsModel";
import { SetValue } from "@/libs/components-functions/SetValuesTo";
import { ChannelSelectMenuInteraction } from "discord.js";

export class MarryChannelSelect extends BaseComponent {
  constructor() {
    super({
      customId: "categoryselect",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ChannelSelectMenuInteraction) {
    await SetValue({
      interaction: interaction,
      once: true,
      model: MarrySettingsModel,
      field: "loveroomCategory"
    })
  }
}
