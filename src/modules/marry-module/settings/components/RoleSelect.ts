import BaseComponent from "@/abstractions/BaseComponent";
import { MarrySettingsModel } from "@/db/models/economy/MarrySettingsModel";
import { roleMention, RoleSelectMenuInteraction } from "discord.js";

export class MarryRoleSelect extends BaseComponent {
  constructor() {
    super({
      customId: "marryroleselect",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: RoleSelectMenuInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const value = interaction.values[0];
    interaction.editReply({
      content: `**Успешно** установлена роль для браков ${roleMention(value)}`,
    });
    await MarrySettingsModel.updateOne(
      {
        guildId: interaction.guild.id,
      },
      {
        marryRole: value,
      }
    );
  }
}
