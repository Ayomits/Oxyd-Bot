import BaseSelectMenuValue from "@/abstractions/BaseSelectMenuValue";
import { StringSelectMenuInteraction } from "discord.js";
import { VerificationRolesCreateNewModal } from "./RolesCreateNew";

export class VerificationRolesUpdate extends BaseSelectMenuValue {
  constructor() {
    super("update");
  }

  public async execute(
    interaction: StringSelectMenuInteraction,
    args: string[]
  ): Promise<any> {
    const modal = await VerificationRolesCreateNewModal(args[0]);
    return await interaction.showModal(modal);
  }
}
