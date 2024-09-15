import BaseCommand from "@/abstractions/BaseCommand";
import { SnowflakeColors, SnowflakeType } from "@/enums";
import {
  ActionRowBuilder,
  bold,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  channelMention,
  CommandInteraction,
  ComponentType,
  EmbedBuilder,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { ScheduleMessageModel } from "@/db/models/schedule-messages";
import { discordTimestampFormat } from "@/utils/functions/discordTimestamp";
import { SnowflakeTimestamp } from "@/enums/SnowflkeTimestamp";

export class ScheduleManagerCommand extends BaseCommand {
  constructor() {
    super({
      builder: new SlashCommandBuilder()
        .setName(`schedule-manage`)
        .setDescription(`Управление отложенными сообщениями`),
      type: SnowflakeType.Everyone,
      isSlash: true,
    });
  }

  public async execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    let pageNumber = 1;
    const repl = await interaction.editReply(
      await this.response(interaction, pageNumber)
    );

    const collector = repl.createMessageComponentCollector({
      filter: (i) => i.user.id === interaction.user.id,
      componentType: ComponentType.Button,
    });

    collector.on("collect", async (inter: ButtonInteraction) => {
      await inter.deferUpdate();
      if (inter.customId.includes("next")) {
        pageNumber += 1;
        inter.editReply(await this.response(inter, pageNumber));
      } else if (inter.customId.includes("previous")) {
        pageNumber -= 1;
        inter.editReply(await this.response(inter, pageNumber));
      } else if (inter.customId.includes("refresh")) {
        pageNumber = 1;
        inter.editReply(await this.response(inter, pageNumber));
      }
    });
  }

  async response(
    interaction: CommandInteraction | ButtonInteraction,
    pageNumber = 1,
    pageSize = 5
  ) {
    const allSchedules = await ScheduleMessageModel.find({
      guildId: interaction.guild.id,
    })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize + 1);
    const maxPage = Math.ceil(allSchedules.length / pageSize);
    const embed = new EmbedBuilder()
      .setTitle(`Управление отложенными сообщениями`)
      .setThumbnail(interaction.user.displayAvatarURL())
      .setColor(SnowflakeColors.DEFAULT)
      .setFooter({
        text: `Страница: ${maxPage === 0 ? 0 : pageNumber}/${maxPage}`,
      })
      .setTimestamp(new Date());
    let description = "";
    const options = [
      new StringSelectMenuOptionBuilder()
        .setLabel(`Создать новое отложенное сообщение`)
        .setValue(`schedulemessage`)
        .setEmoji("<:ph_plusfill:1284399164159164446>"),
    ];
    if (allSchedules.length >= 1) {
      for (let i = 0; i < allSchedules.length && i <= pageSize; i++) {
        const schedule = allSchedules[i];
        description += `${bold(String(i))}) ${
          schedule.displayName ? schedule.displayName : schedule._id
        }\n${discordTimestampFormat(
          schedule.date.getTime(),
          SnowflakeTimestamp.LONG_DATE_WITH_SHORT_TIME
        )}\n${channelMention(schedule.channelId)}\n\n`;
        options.push(
          new StringSelectMenuOptionBuilder()
            .setValue(`schedulemessage_${String(schedule._id)}`)
            .setLabel(schedule.displayName || String(schedule._id))
        );
      }
    } else {
      description = "У Вас нет ни одного отложенного сообщения";
    }

    const selectMenu =
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId(`schedulemessage`)
          .setPlaceholder(`Выберите нужную опцию`)
          .setOptions(options)
      );
    const nextDisableCondition = pageNumber * pageSize > allSchedules.length;
    const previousDisableCondition = pageNumber === 1;
    const nextButton = new ButtonBuilder()
      .setCustomId(`nextbuttonschedule_${interaction.user.id}`)
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(nextDisableCondition)
      .setEmoji("▶");
    const previousButton = new ButtonBuilder()
      .setCustomId(`previuousschedulebutton_${interaction.user.id}`)
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(previousDisableCondition)
      .setEmoji("◀");
    const refreshButton = new ButtonBuilder()
      .setCustomId(`refreshschedulebutton`)
      .setStyle(ButtonStyle.Primary)
      .setLabel(`Обновить`);
    embed.setDescription(description);
    const paginationRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      previousButton,
      refreshButton,
      nextButton
    );

    return { embeds: [embed], components: [selectMenu, paginationRow] };
  }
}
