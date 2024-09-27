import BaseCommand from "@/abstractions/BaseCommand";
import { SnowflakeColors, SnowflakeType } from "@/enums";
import { Currency } from "@/modules/economy-module-block/configs";
import { EconomyUserActions } from "@/utils/economy/user";
import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

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
    await interaction.deferReply();
    const user = interaction.options.get("user")?.user || interaction.user;
    const dbUser = new EconomyUserActions(interaction.guildId, user.id);
    const fetched = await dbUser.fetch();
    const embed = new EmbedBuilder()
      .setColor(SnowflakeColors.DEFAULT)
      .setTitle(`Баланс пользователя ${user.globalName}`)
      .setThumbnail(interaction.user.displayAvatarURL())
      .setTimestamp(new Date())
      .setFooter({
        text: interaction.user.globalName,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setFields({
        name: `> ${Currency.PluralName} ${Currency.Emoji}:`,
        value: `\`\`\`${fetched.balance}\`\`\``,
      });
    return interaction.editReply({ embeds: [embed] });
  }
}
