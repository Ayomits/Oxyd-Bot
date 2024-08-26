import BaseComponent from "@/abstractions/BaseComponent";
import { ModalSubmitInteraction } from "discord.js";

export class VerificationSettingsEmbedModal extends BaseComponent {
  constructor() {
    super("manageEmbedModal", 600);
  }
  async execute(interaction: ModalSubmitInteraction, args?: string[]) {
    
  }
}
