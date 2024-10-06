import { BaseGuildDocument } from "@/db/base/GuildDocument";
import { model, Schema } from "mongoose";

export interface TeleportDocument extends BaseGuildDocument {
  channelId: string; // телепорт канал
  channels: string[];
  ignoredChannels: string[];
  categories: string[];
  displayName: string;
  enable: boolean;
}

export const TeleportSchema = new Schema<TeleportDocument>({
  guildId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    default: `Телепорт ${Math.random().toFixed(1)}`,
  },
  enable: {
    type: Boolean,
    default: true,
  },
  categories: {
    type: [],
    default: [],
  },
  channelId: {
    type: String,
    default: null,
  },
  ignoredChannels: {
    type: [],
    default: [],
  },
  channels: {
    type: [],
    default: [],
  },
});

export const TeleportModel = model<TeleportDocument>(
  "guild_teleports",
  TeleportSchema
);
