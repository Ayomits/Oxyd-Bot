import BaseCommand from "@/abstractions/BaseCommand";
import { SnowflakeType } from "@/enums";
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
            .setName(`Пользователь`)
            .setDescription(`Пользователь чей аватар вы хотите просмотреть`)
        )
        .addStringOption((option) =>
          option
            .setName(`Тип`)
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
    const user = interaction.options.get("Пользователь").user;
    const type = interaction.options.get("Тип").value as string;
    const member = await interaction.guild.members.fetch(user.id);
    const embed = new EmbedBuilder()
      .setTitle(`Аватар - ${user.displayName}`)
      .setImage(
        type === "server" ? member.displayAvatarURL() : user.displayAvatarURL()
      );
    return interaction.editReply({embeds: [embed]})
  }
}
