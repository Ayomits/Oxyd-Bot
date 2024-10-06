import BaseComponent from "@/abstractions/BaseComponent";
import { TeleportModel } from "@/db/models/teleport/TeleportModel";
import { isEnabled } from "@/libs/embeds-functions/isEnabled";
import { bold, ButtonInteraction } from "discord.js";

export class TeleportToggler extends BaseComponent {
  constructor() {
    super({
      customId: "teleporembedttoggler",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ButtonInteraction, args: string[]) {
    await interaction.deferReply({ ephemeral: true });
    const existed = await TeleportModel.findOne({ _id: args[0] });
    await existed.updateOne({ enable: !existed.enable });
    return interaction.editReply({
      content: `Телепорт ${bold(existed.displayName)} ${isEnabled(
        existed.enable
      )}`,
    });
  }
}
