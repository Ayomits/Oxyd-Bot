import BaseComponent from "@/abstractions/BaseComponent";
import { ReactionModuleModel } from "@/db/models/economy/ReactionsModel";
import { SetTogglerTo } from "@/libs/components-functions/TogglerTo";
import { ButtonInteraction } from "discord.js";

export class ReactionTogglerUseSetup extends BaseComponent {
  constructor() {
    super({
      customId: "toggleruse",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ButtonInteraction, args: string[]) {
    const field = args[0] as "useSlash" | "usePrefix";
    const moduleName =
      field === "usePrefix" ? "префикс реакций" : "слеш реакций";
    await SetTogglerTo({
      interaction: interaction,
      model: ReactionModuleModel,
      moduleName,
      field,
      ephemeral: true,
    });
  }
}
