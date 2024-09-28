import BaseComponent from "@/abstractions/BaseComponent";
import { VerificationModuleModel } from "@/db/models/verification/VerificationModel";
import {
  ButtonInteraction,
  StringSelectMenuInteraction,
} from "discord.js";
import { verifyUser } from "./VerificationUtils";

export class ButtonVerification extends BaseComponent {
  constructor() {
    super({
      customId: "validvericiationbutton",
    });
  }

  async execute(interaction: ButtonInteraction, args: string[]) {
    return await verifyUser(interaction, args);
  }
}

export class SelectMenuVerification extends BaseComponent {
  constructor() {
    super({
      customId: "validvericiationbutton",
    });
  }

  async execute(interaction: StringSelectMenuInteraction, args: string[]) {
    return await verifyUser(interaction, args);
  }
}
