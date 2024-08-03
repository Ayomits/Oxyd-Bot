import BaseComponent from "@/abstractions/BaseComponent";
import {
  ButtonInteraction,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
  RoleSelectMenuInteraction,
  ChannelSelectMenuInteraction,
  AnySelectMenuInteraction,
} from "discord.js";
import { settingsResponse } from "../SettingsResposne";

export class SettingsRefreshButton extends BaseComponent {
  constructor() {
    super("logsrefresh");
  }

  async execute(interaction: ButtonInteraction, args: string[]): Promise<void> {
    await interaction.deferUpdate();
    const res = await settingsResponse(interaction);
    await interaction.editReply(res);
  }
}
