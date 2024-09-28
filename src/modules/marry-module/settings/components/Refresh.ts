import BaseComponent from "@/abstractions/BaseComponent";
import { ButtonInteraction } from "discord.js";
import { MarrySettingsResponse } from "../Response";

export class RefreshButton extends BaseComponent {
  constructor() {
    super({
      customId: "marrysettingsrefreshidkdk",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ButtonInteraction) {
    await interaction.deferUpdate();
    interaction.editReply((await MarrySettingsResponse(interaction)) as any);
  }
}
