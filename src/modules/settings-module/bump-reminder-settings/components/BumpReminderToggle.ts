import BaseComponent from "@/abstractions/BaseComponent";
import { SomethingWentWrong } from "@/errors/SomethingWentWrong";
import { BumpReminderModuleModel } from "@/models/BumpReminderModel";
import { isEnabled } from "@/utils/functions/isEnabled";
import { bold, ButtonInteraction } from "discord.js";

export class BumpReminderToggler extends BaseComponent {
  constructor() {
    super("bumpremindertoggler", 600);
  }

  async execute(interaction: ButtonInteraction) {
    try {
      await interaction.deferReply({ ephemeral: true });
      const bumpReminder = await BumpReminderModuleModel.findOne({
        guildId: interaction.guild.id,
      });
      const newBumpReminder = await BumpReminderModuleModel.findOneAndUpdate(
        bumpReminder._id,
        {
          enable: !bumpReminder.enable,
        },
        { new: true }
      );
      return interaction.editReply({
        content: `Успешно ${bold(
          isEnabled(newBumpReminder.enable).toLowerCase()
        )} модуль напоминаний о бампах`,
      });
    } catch {
      return new SomethingWentWrong(interaction);
    }
  }
}
