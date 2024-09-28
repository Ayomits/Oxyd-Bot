import BaseComponent from "@/abstractions/BaseComponent";
import { ButtonInteraction } from "discord.js";
import { VerificationResponse } from "../../Response";

export class VerificationHelloBackButton extends BaseComponent {
  constructor() {
    super({
      customId: "helloverifcationbackbutton",
      ttl: 600,
      authorOnly: true
    });
  }

  async execute(interaction: ButtonInteraction) {
    await interaction.deferUpdate();
    interaction.editReply(await VerificationResponse(interaction));
  }
}
