import BaseComponent from "@/abstractions/BaseComponent";
import { SomethingWentWrong } from "@/errors/SomethingWentWrong";
import { ButtonInteraction } from "discord.js";
import { VerificationResponse } from "../Response";

export class VerificationSettingsRefresh extends BaseComponent {
  constructor() {
    super("refreshVerificationSettings", 600);
  }

  async execute(interaction: ButtonInteraction) {
    try {
      await interaction.deferUpdate();
      interaction.editReply(await VerificationResponse(interaction));
    } catch {
      return new SomethingWentWrong(interaction);
    }
  }
}
