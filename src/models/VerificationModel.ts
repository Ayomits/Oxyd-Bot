import { Document, model, Schema } from "mongoose";
import { BaseModuleGuildDocument } from "./base/GuildDocument";
import { Embed, Snowflake } from "discord.js";

export interface VerificationModuleDocument extends BaseModuleGuildDocument {
  roles: Snowflake[];
  channel: Snowflake;
  messages: any[];
  unverifyRole: Snowflake;
  giveUnverify: boolean;
  logChannel: Snowflake;
}

export const VerificationModuleSchema = new Schema<VerificationModuleDocument>({
  guildId: {
    type: String,
    required: true,
  },
  enable: {
    type: Boolean,
    default: false,
  },
  unverifyRole: {
    type: String,
    default: null,
  },
  channel: {
    type: String,
    default: null,
  },
  messages: {
    type: [],
    default: [],
  },
  logChannel: {
    type: String,
    default: null,
  },
  giveUnverify: {
    type: Boolean,
    default: false,
  },
});

export const VerificationModuleModel = model<VerificationModuleDocument>(
  "guild_verification",
  VerificationModuleSchema
);
