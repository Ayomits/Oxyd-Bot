import { Job, scheduledJobs, scheduleJob } from "node-schedule";
import {
  Monitoring,
  MonitoringBots,
  monitoringDescriptions,
  monitoringKey,
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
      if (
        monitoringDescriptions[MonitoringBots.DISCORD_MONITORING].bad.some(
          (desc) => embed.description.includes(desc)
        )
      ) {
        await this.setNext(bumpSettings, "discordMonitoring", timestamp);
      } else {
        await this.setNextAndLast(bumpSettings, "discordMonitoring", timestamp);
      }
      this.setSchedule(msg.guild, MonitoringBots.DISCORD_MONITORING, timestamp);
    }
    if (msg.author.id === MonitoringBots.SDC_MONITORING) {
      if (
        monitoringDescriptions[MonitoringBots.SDC_MONITORING].success.some(
          (desc) => embed.description.includes(desc)
        )
      ) {
        const timestamp = new Date().getTime() + 3600 * 4 * 1000;
        await this.setNextAndLast(bumpSettings, "sdc", timestamp);
        this.setSchedule(msg.guild, MonitoringBots.SDC_MONITORING, timestamp);
      } else {
        const stringTimestamp = embed.description
          .match(/<t:(\d+):([tTdDfFR]?)>/)[0]
          .replaceAll(/\D/g, "");
        const timestamp = new Date(Number(stringTimestamp) * 1000);
        await this.setNext(bumpSettings, "sdc", timestamp);
        this.setSchedule(msg.guild, MonitoringBots.SDC_MONITORING, timestamp);
      }
    }
    if (msg.author.id === MonitoringBots.SERVER_MONITORING) {
      if (
        monitoringDescriptions[MonitoringBots.SERVER_MONITORING].success.some(
          (desc) => embed.description.includes(desc)
        )
      ) {
        const timestamp = new Date().getTime() + 3600 * 4 * 1000;
        await this.setNextAndLast(bumpSettings, "serverMonitoring", timestamp);
        this.setSchedule(
          msg.guild,
          MonitoringBots.SERVER_MONITORING,
          timestamp
        );
      } else {
        const timestamp = this.findHHMMSS(embed.description);
        await this.setNextAndLast(
          bumpSettings,
          "serverMonitoring",
          new Date().getTime() + timestamp
        );
        this.setSchedule(
          msg.guild,
          MonitoringBots.SERVER_MONITORING,
          timestamp
        );
      }
    }
  }

  public static setSchedule(
    guild: Guild,
    monitoring: Monitoring,
    timestamp: string | number | Date
  ): void {
    const existed = this.cache.get(
      this.cacheKeyGenerator(guild.id, monitoring)
    );
    if (existed) {
      existed.cancel();
    }
    const date =
      typeof timestamp === "number" || typeof timestamp === "string"
        ? new Date(timestamp)
        : timestamp;

    const job = scheduleJob(
      date,
      async () => await this.scheduleFunction(guild, monitoring)
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
      async () => await this.scheduleFunction(guild, monitoring)
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

  private static async scheduleFunction(guild: Guild, monitoring: Monitoring) {
    const bumpSettings = await BumpReminderModuleModel.findOne({
      guildId: guild.id,
    });
    const pingChannel = guild.channels.cache.get(
      bumpSettings.pingChannelId
    ) as TextChannel;
    if (!pingChannel) return;
    const pingRoles =
      bumpSettings.pingRoleIds.length >= 1
        ? bumpSettings.pingRoleIds
            .filter((role) => guild.roles.cache.get(role))
            .map((role) => roleMention(role))
            .join(" ")
        : "";
    pingChannel.send({
      content: `${pingRoles} в данный момент доступен: ${userMention(
        monitoring
      )}`,
    });
  }

  public static async setNextAndLast(
    bumpSettings: BumpReminderModuleDocument,
    key: keyof BumpReminderModuleDocument,
    nextTimestamp: Date | number | string
  ) {
    const updateData = {
      $set: {
        [`${key}.last`]: new Date(),
        [`${key}.next`]:
          typeof nextTimestamp === "string" || typeof nextTimestamp === "number"
            ? new Date(nextTimestamp)
            : nextTimestamp,
      },
    };

    return await BumpReminderModuleModel.findOneAndUpdate(
      { _id: bumpSettings._id },
      updateData,
      { new: true } // Оп
    );
  }

  public static async setNext(
    bumpSettings: BumpReminderModuleDocument,
    key: keyof BumpReminderModuleDocument,
    nextTimestamp: Date | number | string
  ) {
    const updateData = {
      $set: {
        [`${key}.next`]:
          typeof nextTimestamp === "string" || typeof nextTimestamp === "number"
            ? new Date(nextTimestamp)
            : nextTimestamp,
      },
    };

    return await BumpReminderModuleModel.findOneAndUpdate(
      { _id: bumpSettings._id },
      updateData,
      { new: true }
    );
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
