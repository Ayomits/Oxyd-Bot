import BaseComponent from "@/abstractions/BaseComponent";
import { ButtonInteraction } from "discord.js";

export class TeleportSettingsRefresher extends BaseComponent {
  constructor() {
    super({
      customId: "",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ButtonInteraction){
  }
}
