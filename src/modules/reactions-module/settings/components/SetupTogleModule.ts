import BaseComponent from "@/abstractions/BaseComponent";
import { ButtonInteraction } from "discord.js";
import { ReactionModuleModel } from "@/db/models/economy/ReactionsModel";
import { SetTogglerTo } from "@/libs/components-functions/TogglerTo";

export class SetupToggleModule extends BaseComponent {
  constructor() {
    super({
      customId: "toggleReactionModule",
      ttl: 600,
      authorOnly: true,
    });
  }
  async execute(interaction: ButtonInteraction, args?: string[]) {
    await SetTogglerTo({
      interaction: interaction,
      model: ReactionModuleModel,
      moduleName: "реакций",
      ephemeral: true,
    });
  }
}
