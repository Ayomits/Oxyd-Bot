import { SnowflakeLanguage, SnowflakeType } from "@/enums";
import Logger from "@/utils/system/Logger";
import prisma from "@prisma";
import { Snowflake } from "discord.js";

export default class GuildService {
  static async createBlank(guildId: Snowflake) {
    try {
      return await prisma.guild.create({
        data: {
          id: guildId,
          type: SnowflakeType.Everyone,
          language: SnowflakeLanguage.ENGLISH,
          logSettings: {
            create: {},
          },
        },
      });
    } catch(err) {
      Logger.warn(`This guild already exist`)
    }
  }
  static async findOne(guildId: Snowflake) {
    return await prisma.guild.findFirst({ where: { id: guildId } });
  }
  static async findOneRelations(guildId: Snowflake) {
    return await prisma.guild.findFirst({
      where: { id: guildId },
      include: { logSettings: true },
    });
  }
  static async findAll() {
    return await prisma.guild.findMany();
  }

  static async update(guildId: Snowflake, dto: any) {
    return await prisma.guild.update({ where: { id: guildId }, data: dto });
  }

  static async delete(guildId: Snowflake) {
    return await prisma.guild.delete({ where: { id: guildId } });
  }
}
