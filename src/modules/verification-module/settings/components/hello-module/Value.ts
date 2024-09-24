import BaseComponent from "@/abstractions/BaseComponent";
import { ButtonInteraction, StringSelectMenuInteraction } from "discord.js";
import { VerificationHelloResponse } from "./Response";
import BaseSelectMenuValue from "@/abstractions/BaseSelectMenuValue";

export class VerificationHelloRefreshButton extends BaseSelectMenuValue {
  constructor() {
    super("helloverification");
  }

  async execute(interaction: StringSelectMenuInteraction) {
    await interaction.deferUpdate();
    interaction.editReply(await VerificationHelloResponse(interaction));
  }
}
