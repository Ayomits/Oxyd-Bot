import BaseComponent from "@/abstractions/BaseComponent";
import { ButtonInteraction } from "discord.js";
import { settingsResponse } from "../SetupResponse";

export class SettingsRefreshButton extends BaseComponent {
  constructor() {
    super({
      customId: "logsrefresh",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ButtonInteraction, args: string[]): Promise<void> {
    await interaction.deferUpdate();
    const res = await settingsResponse(interaction);
    await interaction.editReply(res);
  }
}
