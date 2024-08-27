import BaseComponent from "@/abstractions/BaseComponent";
import { VerificationModuleModel } from "@/models/VerificationModel";
import {
  ButtonInteraction,
  GuildMember,
  roleMention,
  StringSelectMenuInteraction,
} from "discord.js";
import { verifyUser } from "./VerificationUtils";

export class ButtonVerification extends BaseComponent {
  constructor() {
    super("validvericiationbutton");
  }

  async execute(interaction: ButtonInteraction, args: string[]) {
    return await verifyUser(interaction, args);
  }
}

export class SelectMenuVerification extends BaseComponent {
  constructor() {
    super("validverificationselect");
  }

  async execute(interaction: StringSelectMenuInteraction, args: string[]) {
    return await verifyUser(interaction, args);
  }
}
