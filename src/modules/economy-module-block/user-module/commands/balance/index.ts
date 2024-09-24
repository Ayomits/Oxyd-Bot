import BaseCommand from "@/abstractions/BaseCommand";
import { SnowflakeColors, SnowflakeType } from "@/enums";
import { EconomyUserActions } from "@/utils/economy/user";
import { CommandInteraction, EmbedBuilder, SlashCommandBuilder, User } from "discord.js";

export class BalanceCommand extends BaseCommand {
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
    const user = interaction.options.get("user")?.user || interaction.user
    const dbUser = new EconomyUserActions(interaction.guildId, user.id)
    const fetched = await dbUser.fetch()
    const embed = new EmbedBuilder()
      .setColor(SnowflakeColors.DEFAULT)
      .setDescription(``)
  }
}
