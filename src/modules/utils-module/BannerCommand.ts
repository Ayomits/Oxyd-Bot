import BaseCommand from "@/abstractions/BaseCommand";
import { SnowflakeType } from "@/enums";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export class BannerCommand extends BaseCommand {
  constructor() {
    super({
      type: SnowflakeType.Everyone,
      builder: new SlashCommandBuilder()
        .setName(`banner`)
        .setDescription(`Просмотреть баннер пользователя`)
        .addUserOption((option) =>
          option
            .setName(`Пользователь`)
            .setDescription(`Пользователь чей баннер вы хотите просмотреть`)
        ),
      isSlash: true,
    });
  }

  async execute(interaction: CommandInteraction) {
    
  }
}
