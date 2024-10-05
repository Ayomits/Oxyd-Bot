import BaseCommand from "@/abstractions/BaseCommand";
import { SnowflakeType } from "@/enums";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { TeleportSettingsResponse } from "./Response";

export class TeleportSettingsCommand extends BaseCommand {
  constructor() {
    super({
      builder: new SlashCommandBuilder()
      .setName(`teleport-settings`)
      .setDescription(`Настройка модуля телепортов`),
      type: SnowflakeType.Everyone,
      isSlash: true
    })
  }

  async execute(interaction: CommandInteraction){
    await interaction.deferReply({ephemeral: true})
    interaction.editReply(await TeleportSettingsResponse(interaction))
  }
}