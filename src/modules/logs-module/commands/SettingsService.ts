import prisma from "@/db/prisma";

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
}
