import BaseComponent from "@/abstractions/BaseComponent";
import { SomethingWentWrong } from "@/errors/SomethingWentWrong";
import { BumpReminderModuleModel } from "@/db/models/bump-reminder/BumpReminderModel";
import { RoleSelectMenuInteraction } from "discord.js";

export class BumpReminderPingRoles extends BaseComponent {
  constructor() {
    super({
      customId: "bumpreminderroles",
      ttl: 600,
      authorOnly: true,
    });
  }
  async execute(interaction: RoleSelectMenuInteraction) {
    try {
      await interaction.deferReply({ ephemeral: true });
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
