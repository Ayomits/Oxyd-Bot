import { LogModuleModel } from "@/models/LogsModel";
import { Guild, TextChannel } from "discord.js";

export default class SettingsService {
  static async findOne(guildId: string) {
    return await LogModuleModel.findOne({ guildId: guildId });
  }
  static async update(guildId: string, dto: any) {
    return await LogModuleModel.updateOne(
      {
        guildId: guildId,
      },
      { ...dto }
    );
  }

  static async fetchLogChannel(guild: Guild, key: string) {
    const query = await this.findOne(guild.id);
    const logChannel = await guild.channels.fetch(query[key]);
    return logChannel as TextChannel;
  }
}
