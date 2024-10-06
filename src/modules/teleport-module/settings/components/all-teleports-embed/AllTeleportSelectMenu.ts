import BaseComponent from "@/abstractions/BaseComponent";
import { SetResponseTo } from "@/libs/components-functions/SetResponseTo";
import { StringSelectMenuInteraction } from "discord.js";
import { TeleportEmbedResponse } from "../teleport-embed/Response";

export class AllTeleportSelectMenu extends BaseComponent {
  constructor() {
    super({
      customId: "teleportselectmenu",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: StringSelectMenuInteraction, _args: string[]) {
    const value = interaction.values[0];
    const resFunc = async () => {
      return await TeleportEmbedResponse(interaction, value);
    };
    await interaction.deferUpdate();
    interaction.editReply(await resFunc());
  }
}
