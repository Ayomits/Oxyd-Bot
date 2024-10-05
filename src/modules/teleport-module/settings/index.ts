import BaseCommand from "@/abstractions/BaseCommand";
import { SnowflakeType } from "@/enums";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { TeleportSettingsResponse } from "./Response";
import { SetResponseTo } from "@/libs/components-functions/SetResponseTo";

export class TeleportSettingsCommand extends BaseCommand {
  constructor() {
    super({
      builder: new SlashCommandBuilder()
        .setName(`teleport-settings`)
        .setDescription(`Настройка модуля телепортов`),
      type: SnowflakeType.Everyone,
      isSlash: true,
    });
  }

  async execute(interaction: CommandInteraction) {
    await SetResponseTo(interaction, TeleportSettingsResponse, false);
  }
}
