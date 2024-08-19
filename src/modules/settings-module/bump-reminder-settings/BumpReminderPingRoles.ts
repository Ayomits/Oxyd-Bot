import BaseComponent from "@/abstractions/BaseComponent";
import { SomethingWentWrong } from "@/errors/SomethingWentWrong";
import { BumpReminderModuleModel } from "@/models/BumpReminderModel";
import { RoleSelectMenuInteraction } from "discord.js";

export class BumpReminderPingRoles extends BaseComponent {
  constructor() {
    super("bumpreminderroles", 600);
  }
  async execute(interaction: RoleSelectMenuInteraction) {
    try {
      await interaction.deferReply();
      await BumpReminderModuleModel.updateOne(
        { guildId: interaction.guild.id },
        { pingRoleIds: interaction.values }
      );
      return interaction.editReply({
        content: `Успешно **установлены** роли для пинга`,
      });
    } catch {
      return new SomethingWentWrong(interaction);
    }
  }
}
