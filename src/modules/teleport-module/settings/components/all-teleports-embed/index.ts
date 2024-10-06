import BaseComponent from "@/abstractions/BaseComponent";
import { SetResponseTo } from "@/libs/components-functions/SetResponseTo";
import {
  ButtonInteraction,
  ComponentType,
  InteractionResponse,
} from "discord.js";
import { AllTeleportsResponse } from "./AllTeleportsResponse";

export class TeleportsButton extends BaseComponent {
  constructor() {
    super({
      customId: "teleportsettingsgoto",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ButtonInteraction) {
    let pageNumber = 1;
    const repl = await SetResponseTo({
      interaction,
      replFunc: AllTeleportsResponse,
      defer: {
        update: true,
      },
      ephemeral: true,
    });
    const collector = repl.createMessageComponentCollector({
      filter: (i) =>
        i.user.id === interaction.user.id &&
        (i.customId === "teleportnext" || i.customId === "teleportprevious"),
      componentType: ComponentType.Button,
    });
    collector.on("collect", async (inter) => {
      if (inter.customId === "teleportnext") {
        pageNumber += 1;
      } else if (inter.customId === "teleportprevious") {
        pageNumber = Math.max(pageNumber - 1, 1);
      }
      const replFunc = async () => {
        return await AllTeleportsResponse(inter, pageNumber);
      };
      return await SetResponseTo({
        interaction: inter,
        replFunc,
        defer: {
          update: true,
        },
      });
    });
  }
}
