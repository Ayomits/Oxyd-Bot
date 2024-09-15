import { BaseGuildDocument } from "@/db/base/GuildDocument";
import { Snowflake } from "discord.js";
import { model, Schema } from "mongoose";

export interface ScheduleMessageDocument extends BaseGuildDocument {
  data: any;
  channelId: Snowflake;
  date: Date;
  createdAt: Date
  displayName: string
}

export const ScheduleMessageSchema = new Schema<ScheduleMessageDocument>({
  guildId: {
    type: String,
    required: true,
  },
  channelId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  data: {
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  displayName: {
    type: String,
    default: null,
    maxLength: 50
  }
});

export const ScheduleMessageModel = model<ScheduleMessageDocument>(
  "guild_schedule_messages",
  ScheduleMessageSchema
);
