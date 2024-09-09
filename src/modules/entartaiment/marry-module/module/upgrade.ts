import BaseCommand from "@/abstractions/BaseCommand";
import { MarryModel } from "@/db/models/economy/MaryModel";
import { SnowflakeColors, SnowflakeType } from "@/enums";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  ComponentType,
  EmbedBuilder,
  SlashCommandBuilder,
  userMention,
} from "discord.js";
import { MarryRequiredLvls, MarryType } from "./configs";
import { MarrySettingsModel } from "@/db/models/economy/MarrySettingsModel";

export class MarryUpgrade extends BaseCommand {
  constructor() {
    super({
      builder: new SlashCommandBuilder()
        .setName(`marry-upgrade`)
        .setDescription(`Улучшить отношения`),
      isSlash: true,
      type: SnowflakeType.Everyone,
    });
  }

  async execute(interaction: CommandInteraction) {
    const marrySettings = await MarrySettingsModel.findOne({
      guildId: interaction.guild.id,
    });
    if (!marrySettings.enable)
      return interaction.reply({
        content: `Модуль браков не включен на сервере`,
        ephemeral: true
      });
    const embed = new EmbedBuilder()
      .setTitle(`Улучшение отношений`)
      .setColor(SnowflakeColors.DEFAULT)
      .setThumbnail(interaction.user.displayAvatarURL())
      .setTimestamp(new Date());
    const existed = await MarryModel.findOne({
      guildId: interaction.guild.id,
      $or: [
        {
          partner1Id: interaction.user.id,
        },
        {
          partner2Id: interaction.user.id,
        },
      ],
    });

    if (!existed)
      return interaction.reply({
        embeds: [embed.setDescription(`У **Вас** нет отношений`)],
      });
    if (
      existed.lvl >= MarryRequiredLvls.LOVE ||
      existed.lvl >= MarryRequiredLvls.MARRY
    ) {
      if (existed.type + 1 > MarryType.MARRIAGE)
        return interaction.reply({
          embeds: [
            embed.setDescription(
              `Ваши отношения достигли максимальной ступени`
            ),
          ],
          ephemeral: true,
        });
      const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId(`accept_upgrade`)
          .setEmoji("✅")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`decline_upgrade`)
          .setEmoji("❌")
          .setStyle(ButtonStyle.Secondary)
      );
      const partner =
        existed.partner1Id === interaction.user.id
          ? existed.partner2Id
          : existed.partner1Id;
      const repl = await interaction.reply({
        content: `${userMention(partner)}`,
        embeds: [
          embed.setDescription(
            `Готовы ли Вы перешагнуть на новый этап отношений?`
          ),
        ],
        components: [buttons],
      });
      const collector = (await repl).createMessageComponentCollector({
        filter: (i) =>
          i.user.id === partner || global.developers.includes(i.user.id),
        componentType: ComponentType.Button,
      });
      collector.once("collect", async (inter: ButtonInteraction) => {
        await inter.deferUpdate();
        if (inter.customId.includes("accept")) {
          await existed.updateOne({
            $inc: {
              type: 1,
            },
          });
          inter.editReply({
            embeds: [
              embed.setDescription(
                `Поздравляем пару ${userMention(partner)} и ${
                  interaction.user
                } с повышением ступени в их отношениях!`
              ),
            ],
            components: [],
          });
        } else {
          inter.editReply({
            embeds: [
              embed.setDescription(
                `Один из партнёров оказался не готов к повышению ступени отношений`
              ),
            ],
            components: [],
          });
        }
      });

      collector.once("end", () => {
        repl.edit({
          embeds: [
            embed.setDescription(`Партнёр не успел подтвердить своё желание`),
          ],
          components: [],
        });
      });
    } else {
      return interaction.reply({
        embeds: [
          embed.setDescription(
            `Ваши отношения ещё **недостаточно** крепки для перехода на следующую ступень`
          ),
        ],
        ephemeral: true,
      });
    }
  }
}
