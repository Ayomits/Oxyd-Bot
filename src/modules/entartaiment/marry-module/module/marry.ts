import BaseCommand from "@/abstractions/BaseCommand";
import { MarryModel } from "@/db/models/economy/MaryModel";
import { SnowflakeColors, SnowflakeType } from "@/enums";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  ComponentType,
  EmbedBuilder,
  SlashCommandBuilder,
  userMention,
} from "discord.js";

export class MarryCommand extends BaseCommand {
  constructor() {
    super({
      builder: new SlashCommandBuilder()
        .setName(`marry`)
        .setDescription(`Вступление в отношения`)
        .addUserOption((option) =>
          option
            .setName(`user`)
            .setDescription(`Желаемый пользователь`)
            .setRequired(true)
        ),
      type: SnowflakeType.Everyone,
      isSlash: true,
    });
  }

  async execute(interaction: CommandInteraction) {
    const user = interaction.options.get("user").user;
    if (user.bot && !global.developers.includes(interaction.user.id)) return;
    const existedMarry = await MarryModel.findOne({
      guildId: interaction.guild.id,
      $or: [
        {
          partner1Id: user.id,
        },
        {
          partner2Id: user.id,
        },
        {
          partner1Id: interaction.user.id,
        },
        {
          partner2Id: interaction.user.id,
        },
      ],
    });
    if (existedMarry)
      return interaction.reply({
        content: `Вы или указанный пользователь **уже** состоит в отношениях`,
        ephemeral: true,
      });
    const embed = new EmbedBuilder()
      .setTitle(`Заключение отношений`)
      .setColor(SnowflakeColors.DEFAULT)
      .setTimestamp(new Date())
      .setThumbnail(interaction.user.displayAvatarURL())
      .setDescription(
        `Пользователь ${userMention(
          interaction.user.id
        )} желает вступить в отношения с пользователем ${userMention(
          user.id
        )}\n\n Что скажешь, ${userMention(user.id)} ?`
      );
    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`accept_${user.id}`)
        .setLabel(`Принять`)
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`decline_${user.id}`)
        .setLabel(`Отклонить`)
        .setStyle(ButtonStyle.Danger)
    );
    const repl = await interaction.reply({
      components: [buttons],
      embeds: [embed],
    });

    const collector = repl.createMessageComponentCollector({
      filter: (i) =>
        i.user.id === user.id ||
        global.developers.includes(interaction.user.id),
      componentType: ComponentType.Button,
    });

    collector.on("collect", async (inter) => {
      await inter.deferUpdate();
      if (inter.customId.includes("accept")) {
        inter.editReply({
          embeds: [
            embed.setDescription(
              `Поздравим ${userMention(interaction.user.id)} и ${userMention(
                user.id
              )} с вступлением в отношения 🎉`
            ),
          ],
          components: [],
        });
        await MarryModel.create({
          guildId: inter.guild.id,
          partner1Id: interaction.user.id,
          partner2Id: user.id,
        });
      } else {
        inter.editReply({
          embeds: [
            embed.setDescription(
              `Пользователь ${userMention(
                user.id
              )} отказался от вступления в отношения`
            ),
          ],
          components: [],
        });
      }
    });
  }
}
