import BaseComponent from "@/abstractions/BaseComponent";
import { ButtonInteraction } from "discord.js";
import { settingsResponse } from "../../SetupResponse";
import { SetResponseTo } from "@/libs/components-functions/SetResponseTo";

export class SettingsRefreshButton extends BaseComponent {
  constructor() {
    super({
      customId: "logsrefresh",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ButtonInteraction, args: string[]): Promise<void> {
    await SetResponseTo({
      interaction,
      replFunc: settingsResponse,
      defer: {
        update: true,
      },
    });
  }
}
