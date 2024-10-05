import BaseComponent from "@/abstractions/BaseComponent";
import { MarrySettingsModel } from "@/db/models/economy/MarrySettingsModel";
import { SetValue } from "@/libs/components-functions/SetValuesTo";
import { roleMention, RoleSelectMenuInteraction } from "discord.js";

export class MarryRoleSelect extends BaseComponent {
  constructor() {
    super({
      customId: "marryroleselect",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: RoleSelectMenuInteraction) {
    await SetValue({
      interaction: interaction,
      once: true,
      model: MarrySettingsModel,
      field: "marryRole"
    })
  }
}
