import BaseSelectMenuValue from "@/abstractions/BaseSelectMenuValue";
import { SomethingWentWrong } from "@/errors/SomethingWentWrong";
import { StringSelectMenuInteraction } from "discord.js";
import { verificationRolesResponse } from "./RolesResponse";

export class RolesValue extends BaseSelectMenuValue {
  constructor() {
    super("roles");
  }

  async execute(interaction: StringSelectMenuInteraction) {
    try {
      await interaction.deferReply({ ephemeral: true });
      return interaction.editReply(
        await verificationRolesResponse(interaction)
      );
    } catch {
      return new SomethingWentWrong(interaction);
    }
  }
}
