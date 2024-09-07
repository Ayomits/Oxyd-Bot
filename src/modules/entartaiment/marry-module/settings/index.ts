import BaseCommand from "@/abstractions/BaseCommand";
import { SnowflakeType } from "@/enums";
import { SomethingWentWrong } from "@/errors/SomethingWentWrong";
import { CommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export class MarrySettingsCommand extends BaseCommand {
  constructor() {
    super({
      builder: new SlashCommandBuilder()
        .setName(`marry-settings`)
        .setDescription(`Настройка модуля браков`)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
      type: SnowflakeType.Everyone,
      isSlash: true
    });
  }

  public async execute(interaction: CommandInteraction) {
    try{
      await interaction.deferReply({ephemeral: true});
      interaction.editReply({})
    }
    catch{
      return new SomethingWentWrong(interaction)
    }
  }
}
