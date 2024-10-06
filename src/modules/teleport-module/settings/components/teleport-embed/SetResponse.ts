import BaseComponent from "@/abstractions/BaseComponent";
import { SetResponseTo } from "@/libs/components-functions/SetResponseTo";
import { ButtonInteraction } from "discord.js";
import { TeleportEmbedResponse } from "./Response";
import { AllTeleportsResponse } from "../all-teleports-embed/AllTeleportsResponse";
import Logger from "@/libs/core-functions/Logger";

export class TeleportRefresher extends BaseComponent {
  constructor() {
    super({
      customId: "teleportembedrefresher",
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
