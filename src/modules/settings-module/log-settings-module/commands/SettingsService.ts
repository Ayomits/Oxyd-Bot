import prisma from "@/db/prisma";
import { Guild, TextChannel } from "discord.js";

export default class SettingsService {
  static async findOne(guildId: string) {
    return await prisma.logSettings.findFirst({ where: { guildId: guildId } });
  }
  static async update(guildId: string, dto: any) {
    return await prisma.logSettings.update({
      where: { guildId: guildId },
      data: dto,
    });
  }

  static async fetchLogChannel(guild: Guild, key: string) {
    const query = await this.findOne(guild.id);
    const logChannel = await guild.channels.fetch(query[key]);
    return logChannel as TextChannel;
  }
}
