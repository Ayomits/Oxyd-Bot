import BaseComponent from "@/abstractions/BaseComponent";
import { SomethingWentWrong } from "@/errors/SomethingWentWrong";
import { BumpReminderModuleModel } from "@/db/models/bump-reminder/BumpReminderModel";
import { isEnabled } from "@/utils/functions/isEnabled";
import { bold, ButtonInteraction } from "discord.js";
import { BumpReminderSchedule } from "../../module/BumpReminderFuncs";
import { MonitoringBots } from "../../module/MonitoringBots";

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
      const { enable } = bumpReminder;
      const newBumpReminder = await BumpReminderModuleModel.findOneAndUpdate(
        bumpReminder._id,
        {
          $set: {
            enable: enable ? !enable : true,
          },
        },
        { new: true }
      );
      try {
        if (!bumpReminder.enable === false) {
          BumpReminderSchedule.removeAll(interaction.guild);
        }
      } catch {}
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
