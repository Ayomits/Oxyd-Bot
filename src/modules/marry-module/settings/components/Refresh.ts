import BaseComponent from "@/abstractions/BaseComponent";
import { ButtonInteraction } from "discord.js";
import { MarrySettingsResponse } from "../Response";
import { SetResponseTo } from "@/libs/components-functions/SetResponseTo";

export class RefreshButton extends BaseComponent {
  constructor() {
    super({
      customId: "marrysettingsrefreshidkdk",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ButtonInteraction) {
    await SetResponseTo(interaction, MarrySettingsResponse);
  }
}
