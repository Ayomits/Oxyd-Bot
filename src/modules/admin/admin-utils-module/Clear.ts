import BaseCommand from "@/abstractions/BaseCommand";
import { SnowflakeType } from "@/enums";
import { SomethingWentWrong } from "@/errors/SomethingWentWrong";
import {
  CommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
  User,
} from "discord.js";

export class Clear extends BaseCommand {
  constructor() {
    super({
      builder: new SlashCommandBuilder()
        .setName(`clear`)
        .setDescription(`Очистить сообщения`)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addNumberOption((option) =>
          option
            .setName(`amount`)
            .setDescription(`Количество сообщений`)
            .setMaxValue(100)
            .setMinValue(1)
            .setRequired(true)
        )
        .addUserOption((option) =>
          option
            .setName(`user`)
            .setDescription(`Пользователь от которого нужно очистить`)
            .setRequired(false)
        ),
      isSlash: true,
      type: SnowflakeType.Everyone,
    });
  }

  public async execute(interaction: CommandInteraction) {
    const amount = interaction.options.get("amount").value as number;
    const user = interaction.options.get("user")?.user as User | null;
    const allMessages = await interaction.channel.messages.fetch();
    try {
      await interaction.channel.bulkDelete(
        user
          ? allMessages
              .filter((message) => message.author.id === user.id)
              .map((message) => message)
              .slice(0, amount)
          : allMessages.map((message) => message).slice(0, amount)
      );
    } catch (err) {
      return new SomethingWentWrong(interaction);
    }
    return interaction.reply({
      content: `Успешно очищено **${amount}** сообщений`,
      ephemeral: true,
    });
  }
}
