import { Document, model, Schema } from "mongoose";
import { BaseModuleGuildDocument } from "./base/GuildDocument";
import { Snowflake } from "discord.js";

export interface LogModuleDocument extends BaseModuleGuildDocument {
  messages: Snowflake;
  voice: Snowflake;
  members: Snowflake;
  joins: Snowflake;
}

export const LogModuleSchema = new Schema<LogModuleDocument>({
  guildId: {
    type: String,
    required: true,
  },
  enable: {
    type: Boolean,
    default: false,
  },
  messages: {
    type: String,
    default: null,
  },
  voice: {
    type: String,
    default: null,
  },
  members: {
    type: String,
    default: null,
  },
  joins: {
    type: String,
    default: null,
  },
});

export const LogModuleModel = model<LogModuleDocument>(
  "guild_log_settings",
  LogModuleSchema
);
