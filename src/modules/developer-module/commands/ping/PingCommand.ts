import BaseCommand from "@/abstractions/BaseCommand";
import { SnowflakeColors } from "@/enums";
import { SnowflakeType } from "@/enums/SnowflakeType";
import {
  ButtonBuilder,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { pingResponse } from "./PingResponse";

export class PingCommand extends BaseCommand {
  constructor() {
    super({
      isSlash: true,
      type: SnowflakeType.Developer,
      builder: new SlashCommandBuilder()
        .setName(`ping`)
        .setDescription(`check bot latency`),
    });
  }

  public async execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const res = pingResponse(interaction);
    return interaction.editReply(res);
  }
}
