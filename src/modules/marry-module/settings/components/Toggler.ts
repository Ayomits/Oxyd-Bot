import BaseComponent from "@/abstractions/BaseComponent";
import { MarrySettingsModel } from "@/db/models/economy/MarrySettingsModel";
import { SetTogglerTo } from "@/libs/components-functions/TogglerTo";
import { ButtonInteraction } from "discord.js";

export class MarrySettingsToggler extends BaseComponent {
  constructor() {
    super({
      customId: "marrysettingstoggleridkdk",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ButtonInteraction) {
    await SetTogglerTo({
      interaction: interaction,
      moduleName: "браков",
      model: MarrySettingsModel,
      ephemeral: true
    });
  }
}
