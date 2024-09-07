import { BaseModuleGuildDocument } from "@/db/base/GuildDocument";
import { Snowflake } from "discord.js";
import { Schema } from "mongoose";

export interface MarrySettingsDocument extends BaseModuleGuildDocument {
  loveroomCategory: Snowflake;
  marryRole: Snowflake;
  loveroomAccess: number;
  maxLvl: number;
}

export const MarrySettingsSchema = new Schema<MarrySettingsDocument>({
  guildId: {
    type: String,
    required: true,
  },
  marryRole: {
    type: String,
    required: true,
  },
  loveroomAccess: {
    type: Number,
    default: 5,
  },
});
