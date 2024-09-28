import BaseComponent from "@/abstractions/BaseComponent";
import { ButtonInteraction } from "discord.js";
import { BumpReminderResponse } from "../BumpReminderResponse";
import { SomethingWentWrong } from "@/errors/SomethingWentWrong";

export class BumpReminderRefresh extends BaseComponent {
  constructor() {
    super({
      customId: "bumprefreshbutton",
      ttl: 600,
      authorOnly: true,
    });
  }
  async execute(interaction: ButtonInteraction) {
    try {
      await interaction.deferUpdate();
      const res = await BumpReminderResponse(interaction);
      return interaction.editReply(res);
    } catch {
      return new SomethingWentWrong(interaction);
    }
  }
}
