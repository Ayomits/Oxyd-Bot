import BaseComponent from "@/abstractions/BaseComponent";
import { ButtonInteraction } from "discord.js";
import { VerificationHelloResponse } from "./Response";

export class VerificationHelloRefreshButton extends BaseComponent {
  constructor() {
    super({
      customId: "helloverifcationrefresher",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ButtonInteraction) {
    await interaction.deferUpdate();
    interaction.editReply(await VerificationHelloResponse(interaction));
  }
}
