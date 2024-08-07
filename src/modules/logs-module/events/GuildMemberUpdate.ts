import BaseEvent from "@/abstractions/BaseEvent";
import {
  EmbedBuilder,
  Events,
  Guild,
  GuildMember,
  TextChannel,
} from "discord.js";
import SettingsService from "../commands/SettingsService";
import { SnowflakeColors } from "@/enums";

export class GuildMemberUpdate extends BaseEvent {
  constructor() {
    super({
      name: Events.GuildMemberUpdate,
      once: false,
    });
  }

  async execute(oldMember: GuildMember, newMember: GuildMember) {
    const { roles } = await SettingsService.findOne(newMember.guild.id);
    const logChannel = (await oldMember.guild.channels.fetch(roles, {
      cache: true,
    })) as TextChannel;
    if (!logChannel) return;

    try {
      const embed = new EmbedBuilder()
        .setColor(SnowflakeColors.DEFAULT)
        .setAuthor({
          name: newMember.user.username,
          iconURL: newMember.displayAvatarURL(),
        })
        .setThumbnail(newMember.displayAvatarURL())
        .setTimestamp(new Date());
      if (oldMember.nickname !== newMember.nickname) {
        embed.setTitle(`Изменение никнейма`).setFields(
          {
            name: `> Старый никнейм`,
            value: `\`\`\`${oldMember.nickname.replaceAll("`", "")}\`\`\``,
          },
          {
            name: `> Новый никнейм`,
            value: `\`\`\`${newMember.nickname.replaceAll("`", "")}\`\`\``,
          }
        );
      }
      const newRoles = this.filterRoles(newMember, oldMember);
      const removedRoles = this.filterRoles(oldMember, newMember);

      if (
        oldMember.roles.cache.size < newMember.roles.cache.size ||
        oldMember.roles.cache.size > newMember.roles.cache.size
      ) {
        embed.setTitle(`Действия с ролями участника`).setFields(
          {
            name: `> Добавленные роли`,
            value: `${newRoles.length >= 1 ? newRoles.join("\n") : "None"}`,
          },
          {
            name: `> Удалённые роли`,
            value: `${
              removedRoles.length >= 1 ? removedRoles.join("\n") : "None"
            }`,
          }
        );
      }
      if (oldMember.displayAvatarURL() != newMember.displayAvatarURL()) {
        embed
          .setTitle(`Изменение аватара`)
          .setThumbnail(newMember.displayAvatarURL());
      }
      return logChannel.send({ embeds: [embed] });
    } catch {}
  }

  private filterRoles(firstState: GuildMember, secondState: GuildMember) {
    return firstState.roles.cache
      .filter((role) => !secondState.roles.cache.has(role.id))
      .map((role) => role);
  }
}
