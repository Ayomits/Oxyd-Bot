import { Document, model, Schema } from "mongoose";
import { BaseModuleGuildDocument } from "./base/GuildDocument";
import { Embed, Snowflake } from "discord.js";

export interface VerificationModuleDocument extends BaseModuleGuildDocument {
  roles: Snowflake[];
  channel: Snowflake;
  embeds: Embed[];
  unverifyRole: Snowflake;
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
  roles: {
    type: [],
    default: [],
  },
  channel: {
    type: String,
    default: null,
  },
  embeds: {
    type: [],
    default: [],
  },
});

export const VerificationModuleModel = model<VerificationModuleDocument>(
  "guild_verification",
  VerificationModuleSchema
);
