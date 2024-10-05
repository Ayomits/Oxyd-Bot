import BaseComponent from "@/abstractions/BaseComponent";
import { SetResponseTo } from "@/libs/components-functions/SetResponseTo";
import { ButtonInteraction, ChannelSelectMenuInteraction } from "discord.js";
import { LogChannelSetupResponse } from "./Response";
import { settingsResponse } from "../../SetupResponse";
import { SetValue } from "@/libs/components-functions/SetValuesTo";
import { LogModuleModel } from "@/db/models/logging/LogsModel";

export class LogChannelSetupRefresh extends BaseComponent {
  constructor() {
    super({
      customId: "logsettingschannelrefherbutton",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ButtonInteraction) {
    await SetResponseTo(interaction, LogChannelSetupResponse);
  }
}
export class LogChannelSetupBack extends BaseComponent {
  constructor() {
    super({
      customId: "logsettingschannelbackbutton",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ButtonInteraction) {
    await SetResponseTo(interaction, settingsResponse);
  }
}

export class LogChannelSetter extends BaseComponent {
  constructor() {
    super({
      customId: "settingsChannelSelect",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ChannelSelectMenuInteraction, args: string[]) {
    await SetValue({
      interaction: interaction,
      field: args,
      model: LogModuleModel,
      once: true,
    });
  }
}
