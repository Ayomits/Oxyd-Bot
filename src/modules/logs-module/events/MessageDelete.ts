import BaseEvent from "@/abstractions/BaseEvent";
import { EmbedBuilder, Events, Message, TextChannel } from "discord.js";
import SettingsService from "../../settings-module/log-settings-module/commands/SettingsService";
import { SnowflakeColors } from "@/enums";

export class MessageDelete extends BaseEvent {
  constructor() {
    super({
      once: false,
      name: Events.MessageDelete,
    });
  }

  async execute(msg: Message) {
    if (msg.author.bot) return;
    const logChannel = await SettingsService.fetchLogChannel(
      msg.guild,
      "messages"
    );
    if (!logChannel) return;
    const embed = new EmbedBuilder()
      .setTitle(`Редактирование сообщения`)
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
          value: `${msg.content.length >= 1 ? msg.content : "None"}`,
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
      content += msg.attachments.map((attachment) => attachment.url).join("\n");
    }
    try {
      return logChannel.send({
        content: content.length >= 1 ? content : null,
        embeds: [embed],
      });
    } catch {}
  }
}
