import BaseEvent from "@/abstractions/BaseEvent";
import { EmbedBuilder, Events, Role, TextChannel } from "discord.js";
import SettingsService from "../../settings-module/log-settings-module/commands/SettingsService";
import { SnowflakeColors } from "@/enums";

export class GuildRoleCreate extends BaseEvent {
  constructor() {
    super({
      once: false,
      name: Events.GuildRoleCreate,
    });
  }

  async execute(role: Role) {
    const logChannel = await SettingsService.fetchLogChannel(
      role.guild,
      "roles"
    );
    if (!logChannel) return;
    try {
      const embed = new EmbedBuilder()
        .setTitle(`Создание роли`)
        .setColor(SnowflakeColors.DEFAULT)
        .setFooter({ text: role.guild.name, iconURL: role.guild.iconURL() })
        .setThumbnail(role.guild.iconURL())
        .setTimestamp(new Date())

        .setFields(
          {
            name: `> Название роли:`,
            value: `**${role.name}**`,
            inline: true,
          },
          {
            name: `> Цвет роли:`,
            value: `${role.hexColor}`,
            inline: true,
          }
        );
      return logChannel.send({ embeds: [embed] });
    } catch {}
  }
}
