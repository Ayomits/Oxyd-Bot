import BaseComponent from "@/abstractions/BaseComponent";
import { LogModuleModel } from "@/db/models/logging/LogsModel";
import { SomethingWentWrong } from "@/errors/SomethingWentWrong";
import { SetTogglerTo } from "@/libs/components-functions/TogglerTo";
import { ButtonInteraction } from "discord.js";

export class SetupToggleModule extends BaseComponent {
  constructor() {
    super({
      customId: "logsToggleModule",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ButtonInteraction, _args?: string[]) {
    await SetTogglerTo({
      interaction,
      model: LogModuleModel,
      moduleName: `логгирования`,
      ephemeral: true,
    });
  }
}
