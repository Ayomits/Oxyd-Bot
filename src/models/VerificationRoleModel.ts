import { ButtonStyle, Snowflake } from "discord.js";
import { BaseGuildDocument } from "./base/GuildDocument";
import { model, Schema } from "mongoose";

export interface VerificationRoleDocument extends BaseGuildDocument {
  roleId: Snowflake;
  displayName: string;
  style: ButtonStyle;
  emoji: string;
}

export const VerificationRoleSchema = new Schema<VerificationRoleDocument>({
  guildId: {
    type: String,
    required: true,
  },
  roleId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: false,
    default: null,
  },
  style: {
    type: Number,
    default: ButtonStyle.Secondary,
  },
  emoji: {
    type: String,
    required: false,
    default: null,
  },
});

export const VerificationRoleModel = model<VerificationRoleDocument>(
  "guild_verification_roles",
  VerificationRoleSchema
);
