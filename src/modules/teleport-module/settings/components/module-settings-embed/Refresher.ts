import BaseComponent from "@/abstractions/BaseComponent";
import { SetResponseTo } from "@/libs/components-functions/SetResponseTo";
import { ButtonInteraction } from "discord.js";
import { TeleportSettingsResponse } from "../../Response";

export class TeleportSettingsRefresher extends BaseComponent {
  constructor() {
    super({
      customId: "teleportsettingsrefresher",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ButtonInteraction) {
    try {
      await SetResponseTo(interaction, TeleportSettingsResponse);
    } catch {}
  }
}
