import { SnowflakeType } from "@/enums";
import { Document, model, Schema } from "mongoose";

export interface GuildDocument extends Document {
  guildId: string;
  type: SnowflakeType;
  prefix: string;
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
});

export const GuildModel = model<GuildDocument>("guilds", GuildSchema)
