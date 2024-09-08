import { BaseModuleGuildDocument } from "@/db/base/GuildDocument";
import { Snowflake } from "discord.js";
import { model, Schema } from "mongoose";

export interface MarrySettingsDocument extends BaseModuleGuildDocument {
  loveroomCategory: Snowflake;
  marryRole: Snowflake;
}

export const MarrySettingsSchema = new Schema<MarrySettingsDocument>({
  guildId: {
    type: String,
    required: true,
  },
  marryRole: {
    type: String,
    default: null,
  },
  loveroomCategory: {
    type: String,
    default: null,
  },
  enable: {
    type: Boolean,
    default: false,
  },
});

export const MarrySettingsModel = model<MarrySettingsDocument>(
  "guild_marry_settings",
  MarrySettingsSchema
);
