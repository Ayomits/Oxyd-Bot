import { Job, scheduledJobs, scheduleJob } from "node-schedule";
import { Monitoring, MonitoringBots, monitoringKey } from "./MonitoringBots";
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
  private static cache: Map<string, Job> = new Map<string, Job>();

  public static async handleMonitoringMessage(msg: Message) {
    const bumpSettings = await BumpReminderModuleModel.findOne({
      guildId: msg.guild.id,
    });
    if (!bumpSettings) return;
    if (!bumpSettings.enable) return;
    const embed = msg.embeds[0];
    if (msg.author.id === MonitoringBots.DISCORD_MONITORING) {
      const timestamp = new Date(embed.timestamp).getTime();
      if (embed.description.includes("You are so hot")) {
        await this.setNext(bumpSettings, "discordMonitoring", timestamp);
      } else {
        await this.setNextAndLast(bumpSettings, "discordMonitoring", timestamp);
      }
      this.setSchedule(
        msg.guild,
        MonitoringBots.DISCORD_MONITORING,
        timestamp,
        "discordMonitoring"
      );
    }
    if (msg.author.id === MonitoringBots.SDC_MONITORING) {
      if (embed.description.includes("Время фиксации апа")) {
        const timestamp = new Date().getTime() + 3600 * 4 * 1000;
        await this.setNextAndLast(bumpSettings, "sdc", timestamp);
        this.setSchedule(
          msg.guild,
          MonitoringBots.SDC_MONITORING,
          timestamp,
          "sdc"
        );
      } else {
        const timestamp = embed.description
          .match(/<t:(\d+):([tTdDfFR]?)>/)[0]
          .replaceAll(/\D/g, "");
        await this.setNext(bumpSettings, "sdc", Number(timestamp) * 1000);
        this.setSchedule(
          msg.guild,
          MonitoringBots.SDC_MONITORING,
          timestamp,
          "sdc"
        );
      }
    }
    if (msg.author.id === MonitoringBots.SERVER_MONITORING) {
      if (embed.description.includes("Server bumped by")) {
        const timestamp = new Date().getTime() + 3600 * 4 * 1000;
        await this.setNextAndLast(bumpSettings, "serverMonitoring", timestamp);
      } else {
        const timestamp = this.findHHMMSS(embed.description);
      }
    }
  }

  public static setSchedule(
    guild: Guild,
    monitoring: Monitoring,
    timestamp: string | number | Date,
    key: keyof BumpReminderModuleDocument
  ): void {
    const existed = this.cache.get(
      this.cacheKeyGenerator(guild.id, monitoring)
    );
    if (existed) return;
    const date =
      typeof timestamp === "number" || typeof timestamp === "string"
        ? new Date(timestamp)
        : timestamp;

    const job = scheduleJob(
      date,
      async () => await this.scheduleFunction(guild, monitoring, key)
    );
    this.cache.set(this.cacheKeyGenerator(guild.id, monitoring), job);
  }

  public static updateSchedule(
    guild: Guild,
    monitoring: Monitoring,
    timestamp: string | number | Date,
    key: keyof BumpReminderModuleDocument
  ): void {
    const existed = this.cache.get(
      this.cacheKeyGenerator(guild.id, monitoring)
    );
    if (!existed) return;
    existed.cancel();
    const job = scheduleJob(
      timestamp,
      async () => await this.scheduleFunction(guild, monitoring, key)
    );
    this.cache.set(this.cacheKeyGenerator(guild.id, monitoring), job);
    console.log(this.cache, scheduledJobs);
  }

  public static removeSchedule(
    guild: Guild,
    monitoring: Monitoring
  ): void | boolean {
    const job = this.cache.get(this.cacheKeyGenerator(guild.id, monitoring));
    if (!job) return;
    job.cancel();
    return true;
  }

  private static cacheKeyGenerator(
    guildId: Snowflake,
    monitoring: Monitoring
  ): string {
    return `${guildId}_${monitoring}`;
  }

  private static async scheduleFunction(
    guild: Guild,
    monitoring: Monitoring,
    key: keyof BumpReminderModuleDocument
  ) {
    const bumpSettings = await BumpReminderModuleModel.findOne({
      guildId: guild.id,
    });
    const pingChannel = guild.channels.cache.get(
      bumpSettings.pingChannelId
    ) as TextChannel;
    if (bumpSettings.pingRoleIds.length < 1) return;
    if (!pingChannel) return;
    const timestamp = new Date().getTime() + 3600 * 1000 * 4;

    pingChannel.send({
      content: `${bumpSettings.pingRoleIds
        .filter((role) => guild.roles.cache.get(role))
        .map((role) => roleMention(role))
        .join(
          " "
        )} команды мониторингов не ждут! В данный момент доступен: ${userMention(
        monitoring
      )}`,
    });
    this.setNext(bumpSettings, monitoringKey[monitoring], timestamp);
    return this.setSchedule(guild, monitoring, timestamp, key);
  }

  public static async setNextAndLast(
    bumpSettings: BumpReminderModuleDocument,
    key: keyof BumpReminderModuleDocument,
    nextTimestamp: Date | number | string
  ) {
    return await bumpSettings.updateOne({
      [key]: {
        last: new Date(),
        next:
          typeof nextTimestamp === "number" || typeof nextTimestamp === "string"
            ? new Date(nextTimestamp)
            : nextTimestamp,
      },
    });
  }

  public static async setNext(
    bumpSettings: BumpReminderModuleDocument,
    key: keyof BumpReminderModuleDocument,
    nextTimestamp: Date | number
  ) {
    return await bumpSettings.updateOne({
      [key]: {
        last: bumpSettings[key].last,
        next: nextTimestamp,
      },
    });
  }

  public static findHHMMSS(timeString: string) {
    const regex = /(\d{2}):(\d{2}):(\d{2})/;
    const match = timeString.match(regex);
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const seconds = parseInt(match[3], 10);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    return totalSeconds * 1000;
  }
}
