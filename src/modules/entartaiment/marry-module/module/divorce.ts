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

export class DivorceCommand extends BaseCommand {
  constructor() {
    super({
      builder: new SlashCommandBuilder()
        .setName(`divorce`)
        .setDescription(`Разрыв отношений`),
      type: SnowflakeType.Everyone,
      isSlash: true,
    });
  }

  public async execute(interaction: CommandInteraction) {
    const embed = new EmbedBuilder()
      .setTitle(`Разрыв отношений`)
      .setColor(SnowflakeColors.DEFAULT)
      .setTimestamp(new Date())
      .setThumbnail(interaction.user.displayAvatarURL());
    const existed = await MarryModel.findOne({
      $or: [
        { partner1Id: interaction.user.id },
        { partner2Id: interaction.user.id },
      ],
    });
    if (!existed)
      return interaction.reply({
        embeds: [embed.setDescription(`Вы **не** состоите в отношениях`)],
        ephemeral: true,
      });

    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`confirm`)
        .setStyle(ButtonStyle.Success)
        .setLabel(`Подтвердить`),
      new ButtonBuilder()
        .setCustomId(`cancel`)
        .setStyle(ButtonStyle.Danger)
        .setLabel(`Отменить`)
    );
    const repl = await interaction.reply({
      embeds: [
        embed.setDescription(
          `Вы уверены, что хотите разорвать отношения с пользователем ${userMention(
            existed.partner2Id === interaction.user.id
              ? existed.partner1Id
              : existed.partner2Id
          )} ?`
        ),
      ],
      components: [buttons],
    });
    const collector = repl.createMessageComponentCollector({
      filter: (i) => i.user.id === interaction.user.id,
      componentType: ComponentType.Button,
    });

    collector.on("collect", async (inter) => {
      if (inter.customId.includes("confirm")) {
        await inter.deferUpdate();
        await existed.deleteOne();
        inter.editReply({
          components: [],
          embeds: [
            embed.setDescription(
              `Отношения пользователей ${userMention(
                existed.partner1Id
              )} и ${userMention(existed.partner2Id)} **успешно** разорваны`
            ),
          ],
        });
      } else {
        inter.editReply({
          embeds: [embed.setDescription(`Операция отменена`)],
          components: [],
        });
      }
    });
  }
}
