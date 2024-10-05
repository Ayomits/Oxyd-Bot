import BaseComponent from "@/abstractions/BaseComponent";
import { ChannelSelectMenuInteraction } from "discord.js";
import { SetValue } from "@/libs/components-functions/SetValuesTo";

export class EconomyBaseSettingsSetter extends BaseComponent {
  constructor() {
    super({
      customId: "economysetterselectmenu",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ChannelSelectMenuInteraction, args: string[]) {
    await SetValue({
      interaction: interaction,
      field: args[0],
      once: false,
      model: EconomyBaseSettingsSetter,
    });
  }
}
