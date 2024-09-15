import BaseSelectMenuValue from "@/abstractions/BaseSelectMenuValue";
import { ScheduleMessageModel } from "@/db/models/schedule-messages";
import { dischookDeParses } from "@/utils/parsers/discohookParser";
import { timeParser } from "@/utils/parsers/timeParser";
import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
} from "@discordjs/builders";
import { StringSelectMenuInteraction, TextInputStyle } from "discord.js";

export class ScheduleManagerCreateValue extends BaseSelectMenuValue {
  constructor() {
    super("schedulemessage");
  }

  async execute(interaction: StringSelectMenuInteraction, args: string[]) {
    const objectId = args[0];
    const existed = objectId
      ? undefined
      : await ScheduleMessageModel.findOne({ _id: objectId });
    const modal = new ModalBuilder()
      .setCustomId(`schedulemanagercreatenewmessagemodal`)
      .setTitle(`Создание нового отложенного сообщения`);

    const displayNameInput = new TextInputBuilder()
      .setLabel(`Отображаемое имя`)
      .setCustomId(`displayName`)
      .setPlaceholder(`пост в новости`)
      .setStyle(TextInputStyle.Short);

    if (existed?.displayName) {
      displayNameInput.setValue(existed.displayName);
    }

    const dateInput = new TextInputBuilder()
      .setLabel(`Дата отправки`)
      .setCustomId(`date`)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder(`DD.MM.YY HH:MM ИЛИ 1h`);

    if (existed?.date) {
      dateInput.setValue(timeParser(existed.date) as string);
    }

    const channelIdInput = new TextInputBuilder()
      .setLabel(`Айди канала`)
      .setCustomId(`channelId`)
      .setPlaceholder("snowflake")
      .setStyle(TextInputStyle.Short);

    if (existed?.channelId) {
      channelIdInput.setValue(existed.channelId);
    }

    const webhookInput = new TextInputBuilder()
      .setLabel(`Вебхук`)
      .setCustomId(`webhookInput`)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder(`https://share.discohook.org/`);

    const webhookValue = await dischookDeParses(existed?.data);
    if (webhookValue) {
      webhookInput.setValue(webhookValue);
    }

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(displayNameInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(dateInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(channelIdInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(webhookInput)
    );

    await interaction.showModal(modal);
  }
}
