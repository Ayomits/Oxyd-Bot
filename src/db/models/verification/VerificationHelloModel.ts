import { BaseModuleGuildDocument } from "@/db/base/GuildDocument";
import { model, Schema } from "mongoose";

export interface VerificationHelloDocument extends BaseModuleGuildDocument {
  message: any;
  channelId: string;
}

export const VerificationHelloSchema = new Schema<VerificationHelloDocument>({
  guildId: {
    type: String,
    required: true,
  },
  enable: {
    type: Boolean,
    default: false,
  },
  message: {
    type: Object,
    default: [],
  },
  channelId: {
    type: String,
    default: null,
  },
});

export const VerificationHelloModel = model<VerificationHelloDocument>(
  "guild_verification_hello",
  VerificationHelloSchema
);
