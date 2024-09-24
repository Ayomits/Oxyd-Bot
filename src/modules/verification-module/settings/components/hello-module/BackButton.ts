import BaseComponent from "@/abstractions/BaseComponent";
import { ButtonInteraction } from "discord.js";
import { VerificationResponse } from "../../Response";

export class VerificationHelloBackButton extends BaseComponent {
  constructor() {
    super("helloverifcationbackbutton", 600);
  }

  async execute(interaction: ButtonInteraction) {
    await interaction.deferUpdate();
    interaction.editReply(await VerificationResponse(interaction));
  }
}
