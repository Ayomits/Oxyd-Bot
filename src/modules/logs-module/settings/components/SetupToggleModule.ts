import BaseComponent from "@/abstractions/BaseComponent";
import { LogModuleModel } from "@/db/models/logging/LogsModel";
import { SomethingWentWrong } from "@/errors/SomethingWentWrong";
import { ButtonInteraction } from "discord.js";

export class SetupToggleModule extends BaseComponent {
  constructor() {
    super("logsToggleModule", 600);
  }

  async execute(interaction: ButtonInteraction, _args?: string[]) {
    await interaction.deferReply({ ephemeral: true });
    try {
      const { enable } = await LogModuleModel.findOne({
        guildId: interaction.guild.id,
      });

      interaction.editReply({
        content: `Успешно ${
          !enable === true ? "включен" : "выключен"
        } модуль логгирования`,
      });
      await LogModuleModel.updateOne(
        {
          guildId: interaction.guild.id,
        },
        {
          enable: !enable,
        }
      );
    } catch {
      return new SomethingWentWrong(interaction);
    }
  }
}
