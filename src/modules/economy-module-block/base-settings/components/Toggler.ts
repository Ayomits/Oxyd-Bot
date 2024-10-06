import BaseComponent from "@/abstractions/BaseComponent";
import { ButtonInteraction } from "discord.js";
import { EconomySettingsModel } from "@/db/models/economy/EconomySettingsModel";
import { isEnabled } from "@/libs/embeds-functions/isEnabled";
import { SetTogglerTo } from "@/libs/components-functions/TogglerTo";

export class EconomyBaseSettingsToggler extends BaseComponent {
  constructor() {
    super({
      customId: "economytoggler",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ButtonInteraction) {
    await SetTogglerTo({
      interaction: interaction,
      model: EconomySettingsModel,
      moduleName: `экономики`,
      ephemeral: true,
    });
  }
}
