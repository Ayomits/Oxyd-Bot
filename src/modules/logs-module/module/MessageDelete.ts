import BaseEvent from "@/abstractions/BaseEvent";
import { EmbedBuilder, Events, Message, TextChannel } from "discord.js";
import SettingsService from "../settings/SetupService";
import { SnowflakeColors } from "@/enums";
import Logger from "@/utils/system/Logger";

export class MessageDelete extends BaseEvent {
  constructor() {
    super({
      once: false,
      name: Events.MessageDelete,
    });
  }

  async execute(msg: Message) {
    try {
      if (msg.author.bot) return;
      const settings = await SettingsService.findOne(msg.guild.id);
      if (!settings) return;
      const { messages, enable } = settings;
      if (!enable) return;
      const logChannel = (await msg.guild.channels.fetch(messages, {
        cache: true,
      })) as TextChannel;
      if (!logChannel) return;
      const embed = new EmbedBuilder()
        .setTitle(`Удалённое сообщения`)
        .setColor(SnowflakeColors.DEFAULT)
        .setFields(
          {
            name: `> Канал`,
            value: `${msg.channel}`,
            inline: true,
          },
          {
            name: `> Сообщение`,
            value: `${msg.url}`,
            inline: true,
          },
          {
            name: `> Автор`,
            value: `${msg.author}`,
            inline: true,
          },
          {
            name: `> Содержимое:`,
            value: `\`\`\`${
              msg.content.length >= 1 ? msg.content.replaceAll("`", "") : "None"
            }\`\`\``,
            inline: false,
          }
        )
        .setThumbnail(msg.author.displayAvatarURL())
        .setTimestamp(new Date())
        .setFooter({
          text: `${msg.author.globalName} | ${msg.author.id}`,
          iconURL: msg.author.displayAvatarURL(),
        });
      let content = ``;
      if (msg.attachments) {
        content += msg.attachments
          .map((attachment) => attachment.url)
          .join("\n");
      }
      try {
        return logChannel.send({
          content: content.length >= 1 ? content : null,
          embeds: [embed],
        });
      } catch {}
    } catch (err) {
      Logger.error(err);
    }
  }
}
