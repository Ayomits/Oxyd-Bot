import BaseComponent from "@/abstractions/BaseComponent";
import { ButtonInteraction } from "discord.js";
import { MarrySettingsResponse } from "../Response";

export class RefreshButton extends BaseComponent {
  constructor() {
    super("marrysettingsrefreshidkdk", 600);
  }

  async execute(interaction: ButtonInteraction) {
    await interaction.deferUpdate();
    interaction.editReply((await MarrySettingsResponse(interaction)) as any);
  }
}
