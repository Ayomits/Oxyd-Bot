import BaseComponent from "@/abstractions/BaseComponent";
import { SomethingWentWrong } from "@/errors/SomethingWentWrong";
import { BumpReminderModuleModel } from "@/db/models/bump-reminder/BumpReminderModel";
import { isEnabled } from "@/libs/embeds-functions/isEnabled";
import { bold, ButtonInteraction } from "discord.js";
import { BumpReminderSchedule } from "../../module/BumpReminderFuncs";
import { MonitoringBots } from "../../module/MonitoringBots";
import { SetTogglerTo } from "@/libs/components-functions/TogglerTo";

export class BumpReminderToggler extends BaseComponent {
  constructor() {
    super({
      customId: "bumpremindertoggler",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ButtonInteraction) {
    await SetTogglerTo({
      interaction,
      model: BumpReminderModuleModel,
      moduleName: `бампов`,
      ephemeral: true,
    });
  }
}
