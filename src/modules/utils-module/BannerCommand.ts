import BaseCommand from "@/abstractions/BaseCommand";
import { SnowflakeColors, SnowflakeType } from "@/enums";
import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

export class BannerCommand extends BaseCommand {
  constructor() {
    super({
      type: SnowflakeType.Everyone,
      builder: new SlashCommandBuilder()
        .setName(`banner`)
        .setDescription(`Просмотреть баннер пользователя`)
        .addUserOption((option) =>
          option
            .setName(`пользователь`)
            .setDescription(`Пользователь чей баннер вы хотите просмотреть`)
        ),
      isSlash: true,
    });
  }

  public async execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const user =
      (await interaction.options.get("пользователь")?.user.fetch()) ||
      (await interaction.user.fetch());
    const bannerURL = user?.bannerURL({ size: 4096 });
    const embed = new EmbedBuilder()
      .setColor(SnowflakeColors.DEFAULT)
      .setTitle(`Баннер - ${user.displayName}`);
    if (!bannerURL) {
      embed.setDescription(`Указанный пользователь **не имеет** баннера`);
    } else {
      embed.setImage(bannerURL);
    }
    await interaction.editReply({ embeds: [embed] });
  }
}
