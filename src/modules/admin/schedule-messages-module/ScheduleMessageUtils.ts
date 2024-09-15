import {
  ScheduleMessageDocument,
  ScheduleMessageModel,
} from "@/db/models/schedule-messages";
import { Guild, TextChannel } from "discord.js";
import { Types } from "mongoose";
import { Job, scheduleJob } from "node-schedule";

export class ScheduleMessageUtils {
  private static cache: Map<Types.ObjectId | any, Job> = new Map();

  public static findFromCache(
    object: Types.ObjectId | ScheduleMessageDocument
  ) {
    const existed = this.cache.get(this.getObjectId(object));
    return existed;
  }

  public static getObjectId(object: Types.ObjectId | ScheduleMessageDocument) {
    return object instanceof Types.ObjectId ? object : object._id;
  }

  public static createSchedule(
    object: Types.ObjectId | ScheduleMessageDocument,
    date: Date,
    guild: Guild
  ) {
    const job = scheduleJob(
      date,
      async () => await this.scheduleFunction(object, guild)
    );
    this.cache.set(this.getObjectId(object), job);
    return this;
  }
  // throw error if existed
  private static async scheduleFunction(
    object: Types.ObjectId | ScheduleMessageDocument,
    guild: Guild
  ) {
    const existed = this.findFromCache(object);
    if (existed) return null;
    let data: ScheduleMessageDocument;
    if (object instanceof Types.ObjectId) {
      data = (await ScheduleMessageModel.findOne({
        _id: object,
      })) as ScheduleMessageDocument;
    } else {
      data = object as ScheduleMessageDocument;
    }
    const response = (data as ScheduleMessageDocument).data.map(
      (message) => message.data
    );
    const channel = guild.channels.cache.get(data.channelId) as TextChannel;
    if (channel) {
      for (const message of response) {
        channel.send(message);
      }
    }
    await this.deleteFromDb(object);
    return this;
  }

  public static async createOrUpdate(
    object: Types.ObjectId | ScheduleMessageDocument,
    date: Date,
    guild: Guild
  ) {
    const existed = this.findFromCache(object);
    if (existed) {
      existed.cancel();
      this.createSchedule(object, date, guild);
    } else {
      this.createSchedule(object, date, guild);
    }
  }

  public static async deleteSchedule(
    object: Types.ObjectId | ScheduleMessageDocument
  ) {
    const existed = this.findFromCache(object);
    if (existed) {
      existed.cancel();
      await this.deleteFromDb(object);
      this.cache.delete(this.getObjectId(object));
      return existed;
    }
    return null;
  }

  public static async deleteFromDb(
    object: Types.ObjectId | ScheduleMessageDocument
  ) {
    await ScheduleMessageModel.deleteOne({ _id: this.getObjectId(object) });
  }
}
