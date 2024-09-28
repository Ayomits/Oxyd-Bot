import BaseComponent from "@/abstractions/BaseComponent";
import { ButtonInteraction } from "discord.js";
import { bumpReminderStatusResponse } from "../Response";

export class PingRefreshButton extends BaseComponent {
  constructor() {
    super({
      customId: "bumpreminderstaturefresh",
      ttl: 600,
      authorOnly: true,
    });
  }
  async execute(interaction: ButtonInteraction, args: string[]) {
    await interaction.deferUpdate();
    const userId = args[0];
    if (userId !== interaction.user.id) return;
    return interaction.editReply(await bumpReminderStatusResponse(interaction));
  }
}
