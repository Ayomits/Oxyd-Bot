import BaseComponent from "@/abstractions/BaseComponent";
import {
  ButtonInteraction
} from "discord.js";
import { settingsResponse } from "../SetupResponse";

export class SettingsRefreshButton extends BaseComponent {
  constructor() {
    super("logsrefresh", 600);
  }

  async execute(interaction: ButtonInteraction, args: string[]): Promise<void> {
    await interaction.deferUpdate();
    const res = await settingsResponse(interaction);
    await interaction.editReply(res);
  }
}