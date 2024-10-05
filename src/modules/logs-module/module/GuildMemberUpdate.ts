import BaseEvent from "@/abstractions/BaseEvent";
import { EmbedBuilder, Events, GuildMember, TextChannel } from "discord.js";
import SettingsService from "../settings/SetupService";
import { SnowflakeColors } from "@/enums";
import Logger from "@/libs/core-functions/Logger";

export class GuildMemberUpdate extends BaseEvent {
  constructor() {
    super({
      name: Events.GuildMemberUpdate,
      once: false,
    });
  }

  async execute(oldMember: GuildMember, newMember: GuildMember) {
    try {
      const settings = await SettingsService.findOne(newMember.guild.id);
      if (!settings) return;
      const { members, enable } = settings;
      if (!enable) return;
      const logChannel = (await newMember.guild.channels.fetch(members, {
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

        const oldNickname = oldMember.nickname || oldMember.user.displayName;
        const newNickname = newMember.nickname || newMember.user.displayName;

        if (oldNickname !== newNickname) {
          embed.setTitle(`Изменение никнейма`).setFields(
            {
              name: `> Старый никнейм`,
              value: `\`\`\`${oldNickname.replaceAll("`", "")}\`\`\``,
            },
            {
              name: `> Новый никнейм`,
              value: `\`\`\`${newNickname.replaceAll("`", "")}\`\`\``,
            }
          );
          return logChannel.send({ embeds: [embed] });
        }

        if (
          oldMember.roles.cache.size < newMember.roles.cache.size ||
          oldMember.roles.cache.size > newMember.roles.cache.size
        ) {
          const newRoles = this.filterRoles(newMember, oldMember);
          const removedRoles = this.filterRoles(oldMember, newMember);

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
          return logChannel.send({ embeds: [embed] });
        }

        if (oldMember.displayAvatarURL() !== newMember.displayAvatarURL()) {
          embed
            .setTitle(`Изменение аватара`)
            .setThumbnail(newMember.displayAvatarURL());
          return logChannel.send({ embeds: [embed] });
        }
      } catch (error) {
        Logger.error("Error executing GuildMemberUpdate event:", error);
      }
    } catch {}
  }

  private filterRoles(firstState: GuildMember, secondState: GuildMember) {
    return firstState.roles.cache
      .filter((role) => !secondState.roles.cache.has(role.id))
      .map((role) => role);
  }
}
