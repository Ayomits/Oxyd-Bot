import { ScheduleMessageModel } from "@/db/models/schedule-messages";
import { SnowflakeColors } from "@/enums";
import { SnowflakeTimestamp } from "@/enums/SnowflkeTimestamp";
import { discordTimestampFormat } from "@/utils/functions/discordTimestamp";
import {
  bold,
  ButtonInteraction,
  channelMention,
  CommandInteraction,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { Types } from "mongoose";

export async function ScheduleManagerResponse(
  interaction: ButtonInteraction | CommandInteraction,
  pageSize = 5,
  pageNumber = 1,
  objectId: Types.ObjectId = null
) {
  const embed = new EmbedBuilder()
    .setThumbnail(interaction.user.displayAvatarURL())
    .setColor(SnowflakeColors.DEFAULT)
    .setTimestamp(new Date());
  const allSchedules = !objectId
    ? await ScheduleMessageModel.find({
        guildId: interaction.guild.id,
      })
    : await ScheduleMessageModel.find({
        guildId: interaction.guild.id,
        _id: objectId,
      });
  let description = "";
  const options = [
    new StringSelectMenuOptionBuilder()
      .setLabel(`Создать новое отложенное сообщение`)
      .setValue(`createnewmessage`)
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
      options.push()
    }
  } else {
    description = "У Вас нет ни одного отложенного сообщения";
  }

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId(
      `schedulemanagerstringselectmenuidkdidk_${interaction.user.id}`
    )
    .setPlaceholder(`Выберите нужную опцию`)
    .setOptions(options);
  return { embeds: [embed], components: [selectMenu] };
}
