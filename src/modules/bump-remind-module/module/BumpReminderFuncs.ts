import { Job, scheduledJobs, scheduleJob } from "node-schedule";
import {
  Monitoring,
  MonitoringBots,
  monitoringDescriptions,
} from "./MonitoringBots";
import {
  BumpReminderModuleDocument,
  BumpReminderModuleModel,
} from "@/models/BumpReminderModel";
import {
  Guild,
  Message,
  roleMention,
  Snowflake,
  TextChannel,
  userMention,
} from "discord.js";

export class BumpReminderSchedule {
  private static cache = new Map<string, Job>();

  public static async handleMonitoringMessage(msg: Message) {
    const bumpSettings = await BumpReminderModuleModel.findOne({
      guildId: msg.guild.id,
    });
    if (!bumpSettings || !bumpSettings.enable) return;

    const { author, embeds, guild } = msg;
    const embed = embeds[0];
    const timestamp = new Date(embed.timestamp).getTime();

    const botHandlers = {
      [MonitoringBots.DISCORD_MONITORING]: async () => {
        if (this.isBad(embed.description, MonitoringBots.DISCORD_MONITORING)) {
          await this.setNext(bumpSettings, "discordMonitoring", timestamp);
        } else {
          await this.setNextAndLast(bumpSettings, "discordMonitoring", timestamp);
        }
      },
      [MonitoringBots.SDC_MONITORING]: async () => {
        if (this.isSuccess(embed.description, MonitoringBots.SDC_MONITORING)) {
          const nextTimestamp = Date.now() + 4 * 3600 * 1000;
          await this.setNextAndLast(bumpSettings, "sdc", nextTimestamp);
        } else {
          const match = embed.description.match(/<t:(\d+):/);
          const nextTimestamp = match ? Number(match[1]) * 1000 : timestamp;
          await this.setNext(bumpSettings, "sdc", nextTimestamp);
        }
      },
      [MonitoringBots.SERVER_MONITORING]: async () => {
        const nextTimestamp = this.isSuccess(embed.description, MonitoringBots.SERVER_MONITORING)
          ? Date.now() + 4 * 3600 * 1000
          : Date.now() + this.findHHMMSS(embed.description);
        await this.setNextAndLast(bumpSettings, "serverMonitoring", nextTimestamp);
      },
    };

    if (botHandlers[author.id]) {
      await botHandlers[author.id]();
      this.setSchedule(guild, author.id as Monitoring, timestamp);
    }
  }

  public static setSchedule(
    guild: Guild,
    monitoring: Monitoring,
    timestamp: string | number | Date
  ): void {
    this.cancelExistingJob(guild.id, monitoring);
    const date = new Date(timestamp);
    const job = scheduleJob(date, async () => await this.scheduleFunction(guild, monitoring));
    this.cache.set(this.cacheKey(guild.id, monitoring), job);
  }

  public static updateSchedule(
    guild: Guild,
    monitoring: Monitoring,
    timestamp: string | number | Date
  ): void {
    this.cancelExistingJob(guild.id, monitoring);
    this.setSchedule(guild, monitoring, timestamp);
  }

  public static removeSchedule(guild: Guild, monitoring: Monitoring): boolean {
    const job = this.cancelExistingJob(guild.id, monitoring);
    return !!job;
  }

  private static cancelExistingJob(guildId: Snowflake, monitoring: Monitoring): Job | undefined {
    const key = this.cacheKey(guildId, monitoring);
    const job = this.cache.get(key);
    job?.cancel();
    this.cache.delete(key);
    return job;
  }

  private static cacheKey(guildId: Snowflake, monitoring: Monitoring): string {
    return `${guildId}_${monitoring}`;
  }

  private static async scheduleFunction(guild: Guild, monitoring: Monitoring) {
    const bumpSettings = await BumpReminderModuleModel.findOne({ guildId: guild.id });
    const pingChannel = guild.channels.cache.get(bumpSettings.pingChannelId) as TextChannel;
    if (!pingChannel) return;

    const pingRoles = bumpSettings.pingRoleIds
      .filter(role => guild.roles.cache.has(role))
      .map(roleMention)
      .join(" ");

    pingChannel.send({
      content: `${pingRoles} Monitoring available: ${userMention(monitoring)}`,
    });
  }

  private static async setNextAndLast(
    bumpSettings: BumpReminderModuleDocument,
    key: keyof BumpReminderModuleDocument,
    nextTimestamp: Date | number | string
  ) {
    await BumpReminderModuleModel.findByIdAndUpdate(bumpSettings._id, {
      $set: {
        [`${key}.last`]: new Date(),
        [`${key}.next`]: new Date(nextTimestamp),
      },
    });
  }

  private static async setNext(
    bumpSettings: BumpReminderModuleDocument,
    key: keyof BumpReminderModuleDocument,
    nextTimestamp: Date | number | string
  ) {
    await BumpReminderModuleModel.findByIdAndUpdate(bumpSettings._id, {
      $set: {
        [`${key}.next`]: new Date(nextTimestamp),
      },
    });
  }

  private static isSuccess(description: string, bot: MonitoringBots): boolean {
    return monitoringDescriptions[bot].success.some(desc => description.includes(desc));
  }

  private static isBad(description: string, bot: MonitoringBots): boolean {
    return monitoringDescriptions[bot].bad.some(desc => description.includes(desc));
  }

  private static findHHMMSS(timeString: string): number {
    const [hours, minutes, seconds] = timeString.match(/\d{2}/g).map(Number);
    return (hours * 3600 + minutes * 60 + seconds) * 1000;
  }
}
