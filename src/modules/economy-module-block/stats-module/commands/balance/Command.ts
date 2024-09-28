import BaseCommand from "@/abstractions/BaseCommand";
import { SnowflakeType } from "@/enums";
import {
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { EconomyBalanceCommandResponse } from "./Response";

export class EconomyBalanceCommand extends BaseCommand {
  constructor() {
    super({
      builder: new SlashCommandBuilder()
        .setName(`balance`)
        .setDescription(`Просмотреть баланса пользователя`)
        .addUserOption((option) =>
          option
            .setName(`user`)
            .setDescription(`Чей баланс вы хотите узнать?`)
            .setRequired(false)
        ),
      type: SnowflakeType.Everyone,
      isSlash: true,
    });
  }

  public async execute(interaction: CommandInteraction) {
    await interaction.deferReply()
    interaction.editReply(await EconomyBalanceCommandResponse(interaction))
  }
}
