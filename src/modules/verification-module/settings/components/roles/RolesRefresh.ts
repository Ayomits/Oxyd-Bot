import BaseComponent from "@/abstractions/BaseComponent";
import { ButtonInteraction } from "discord.js";
import { verificationRolesResponse } from "./RolesResponse";
import { SomethingWentWrong } from "@/errors/SomethingWentWrong";

export class RolesRefresh extends BaseComponent {
  constructor() {
    super({
      customId: "verificationrolesrefresh",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ButtonInteraction) {
    try {
      await interaction.deferUpdate();
      interaction.editReply(await verificationRolesResponse(interaction));
    } catch {
      return new SomethingWentWrong(interaction);
    }
  }
}
