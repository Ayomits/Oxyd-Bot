import { SnowflakeLanguage, SnowflakeType } from "@/enums";
import { Document, model, Schema } from "mongoose";
import { BaseGuildDocument } from "./base/GuildDocument";

export interface GuildDocument extends BaseGuildDocument {
  type: SnowflakeType;
  prefix: string;
  language: SnowflakeLanguage;
}

export const GuildSchema = new Schema<GuildDocument>({
  guildId: {
    type: String,
    required: true,
  },
  type: {
    type: Number,
    required: true,
    default: SnowflakeType.Everyone,
    max: SnowflakeType.Developer,
  },
  prefix: {
    type: String,
    default: ".",
  },
  language: {
    type: String,
    default: SnowflakeLanguage.ENGLISH,
  },
});

export const GuildModel = model<GuildDocument>("guilds", GuildSchema);
