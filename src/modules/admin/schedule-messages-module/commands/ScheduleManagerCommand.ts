import BaseCommand from "@/abstractions/BaseCommand";
import { SnowflakeColors, SnowflakeType } from "@/enums";
import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { ScheduleManagerResponse } from "./ScheduleManagerResponse";

export class ScheduleManagerCommand extends BaseCommand {
  constructor() {
    super({
      builder: new SlashCommandBuilder()
        .setName(`schedule-manage`)
        .setDescription(`Управление отложенными сообщениями`),
      type: SnowflakeType.Everyone,
      isSlash: true,
    });
  }

  public async execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const res = await ScheduleManagerResponse(interaction);
  }
}
