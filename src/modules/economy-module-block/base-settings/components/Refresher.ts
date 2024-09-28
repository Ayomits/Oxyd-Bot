import BaseComponent from "@/abstractions/BaseComponent";
import { ButtonInteraction } from "discord.js";
import { EconomySettingsResponse } from "../Response";

export class EconomyBaseSettingsRefresher extends BaseComponent {
  constructor() {
    super({ customId: "economyrefresher", ttl: 600, authorOnly: true });
  }

  async execute(interaction: ButtonInteraction) {
    await interaction.deferUpdate();
    interaction.editReply(await EconomySettingsResponse(interaction));
  }
}
