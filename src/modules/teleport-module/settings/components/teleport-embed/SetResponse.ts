import BaseComponent from "@/abstractions/BaseComponent";
import { SetResponseTo } from "@/libs/components-functions/SetResponseTo";
import { ButtonInteraction } from "discord.js";
import { TeleportEmbedResponse } from "./Response";
import { AllTeleportsResponse } from "../all-teleports-embed/AllTeleportsResponse";

export class TeleportRefresher extends BaseComponent {
  constructor() {
    super({
      customId: "teleportrefresher",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ButtonInteraction, args: string[]) {
    const replFunc = async () => {
      return await TeleportEmbedResponse(interaction, args[0]);
    };
    await SetResponseTo({
      interaction,
      replFunc,
      defer: {
        update: true,
      },
    });
  }
}
export class TeleportBackButton extends BaseComponent {
  constructor() {
    super({
      customId: "teleportbackbuttone",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ButtonInteraction, args: string[]) {
    await SetResponseTo({
      interaction: interaction,
      ephemeral: false,
      replFunc: AllTeleportsResponse,
      defer: {
        update: true,
      },
    });
  }
}
