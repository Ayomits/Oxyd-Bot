import BaseComponent from "@/abstractions/BaseComponent";
import { SomethingWentWrong } from "@/errors/SomethingWentWrong";
import { VerificationModuleModel } from "@/db/models/verification/VerificationModel";
import { isEnabled } from "@/libs/embeds-functions/isEnabled";
import { ButtonInteraction } from "discord.js";
import { SetTogglerTo } from "@/libs/components-functions/TogglerTo";

export class VerificationModuleToggler extends BaseComponent {
  constructor() {
    super({
      customId: "toggleVerificationModule",
      ttl: 600,
      authorOnly: true,
    });
  }
  async execute(interaction: ButtonInteraction, args: string[]) {
    await SetTogglerTo({
      interaction,
      model: VerificationModuleModel,
      moduleName: "верификации",
      ephemeral: true,
    });
  }
}
