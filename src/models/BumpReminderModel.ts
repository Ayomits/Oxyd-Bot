import { Snowflake } from "discord.js";
import { Document, model, Schema, Types } from "mongoose";
import { BaseModuleGuildDocument } from "./base/GuildDocument";

export type MonitoringType = {
  last: Date | null;
  next: Date | null;
};

export interface BumpReminderModuleDocument extends BaseModuleGuildDocument {
  pingRoleIds: Snowflake[];
  pingChannelId: Snowflake;
  sdc: MonitoringType;
  discordMonitoring: MonitoringType;
  serverMonitoring: MonitoringType;
}

export const BumpReminderModuleSchema = new Schema<BumpReminderModuleDocument>({
  guildId: {
    type: String,
    required: true,
  },
  pingRoleIds: {
    type: [],
    default: [],
  },
  pingChannelId: {
    type: String,
    default: null,
  },
  enable: {
    type: Boolean,
    default: false,
  },
  sdc: {
    last: {
      type: Date,
      default: null,
    },
    next: {
      type: Date,
      default: null,
    },
  },
  discordMonitoring: {
    last: {
      type: Date,
      default: null,
    },
    next: {
      type: Date,
      default: null,
    },
  },
  serverMonitoring: {
    last: {
      type: Date,
      default: null,
    },
    next: {
      type: Date,
      default: null,
    },
  },
});

export const BumpReminderModuleModel = model<BumpReminderModuleDocument>(
  `guild_bumpreminder`,
  BumpReminderModuleSchema
);
