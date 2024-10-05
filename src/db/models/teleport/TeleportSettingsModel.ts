import { BaseModuleGuildDocument } from "@/db/base/GuildDocument";
import { model, Schema } from "mongoose";

export interface TeleportSettingsDocument extends BaseModuleGuildDocument {}

export const TeleportSettingSchema = new Schema<TeleportSettingsDocument>({
  guildId: {
    type: String,
    required: true,
  },
  enable: {
    type: Boolean,
    default: false,
  },
});

export const TeleportSettingsModel = model<TeleportSettingsDocument>(
  "guilds_teleport_settings",
  TeleportSettingSchema
);
