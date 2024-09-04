import BaseCommand from "@/abstractions/BaseCommand";
import { SnowflakeColors, SnowflakeType } from "@/enums";
import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

export class AvatarCommand extends BaseCommand {
  constructor() {
    super({
      type: SnowflakeType.Everyone,
      builder: new SlashCommandBuilder()
        .setName(`avatar`)
        .setDescription(`Просмотреть аватар пользователя`)
        .addUserOption((option) =>
          option
            .setName(`пользователь`)
            .setDescription(`Пользователь чей аватар вы хотите просмотреть`)
        )
        .addStringOption((option) =>
          option
            .setName(`тип`)
            .setDescription(`Аватар пользователя на сервере или в профиле`)
            .setChoices(
              {
                name: `Серверный`,
                value: `server`,
              },
              {
                name: `Пользовательский`,
                value: `user`,
              }
            )
        ),
      isSlash: true,
    });
  }

  public async execute(interaction: CommandInteraction) {
    await interaction.deferReply()
    const user = interaction.options.get("пользователь")?.user || interaction.user;
    const type = interaction.options.get("тип")?.value as string;
    const member = await interaction.guild.members.fetch(user.id);
    const size = 4096
    const embed = new EmbedBuilder()
      .setTitle(`Аватар - ${user.displayName}`)
      .setColor(SnowflakeColors.DEFAULT)
      .setImage(
        type === "server" ? member.displayAvatarURL({size}) : user.displayAvatarURL({size})
      );
    return interaction.editReply({embeds: [embed]})
  }
}
