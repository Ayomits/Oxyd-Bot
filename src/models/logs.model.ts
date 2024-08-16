import { Document, model, Schema } from "mongoose";

export interface LogModuleDocument extends Document {
  guildId: string;
  enable: boolean;
  message: {
    enable: boolean;
    delete: string;
    update: string;
  };
  voice: {
    enable: boolean;
    connect: string;
    move: string;
    disconnect: string;
  };
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
  message: {
    enable: {
      type: Boolean,
      default: false,
    },
    delete: {
      type: String,
      default: null,
    },
    update: {
      type: String,
      default: null,
    },
  },
  voice: {
    enable: {
      type: Boolean,
      default: false,
    },
    connect: {
      type: String,
      default: null,
    },
    disconnect: {
      type: String,
      default: null,
    },
    move: {
      type: String,
      default: null,
    },
  },
});

export const LogModuleModel = model<LogModuleDocument>(
  "guild_log_settings",
  LogModuleSchema
);
