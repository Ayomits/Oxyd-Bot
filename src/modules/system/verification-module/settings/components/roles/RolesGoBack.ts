import BaseComponent from "@/abstractions/BaseComponent";
import { SomethingWentWrong } from "@/errors/SomethingWentWrong";
import { verificationRolesResponse } from "./RolesResponse";
import { ButtonInteraction } from "discord.js";
import { VerificationResponse } from "../../Response";

export class RolesGoBack extends BaseComponent {
  constructor() {
    super("verificationrolesgoback", 600);
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
