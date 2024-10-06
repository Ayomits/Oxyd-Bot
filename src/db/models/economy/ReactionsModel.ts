import { Document, model, Schema } from "mongoose";
import { BaseModuleGuildDocument } from "../../base/GuildDocument";

export interface ReactionModuleDocument extends BaseModuleGuildDocument {
  nsfwReactions: string[];
  commonReactions: string[];
  useSlash: boolean;
  usePrefix: boolean;
}

export const ReactionModuleSchema = new Schema<ReactionModuleDocument>({
  guildId: {
    type: String,
    required: true,
  },
  enable: {
    type: Boolean,
    default: false,
  },
  nsfwReactions: {
    type: [],
    default: [],
    maxlength: 25,
  },
  commonReactions: {
    type: [],
    default: [],
    maxlength: 25,
  },
  usePrefix: {
    type: Boolean,
    default: false,
  },
  useSlash: {
    type: Boolean,
    default: false,
  },
});

export const ReactionModuleModel = model<ReactionModuleDocument>(
  "guild_reaction_module",
  ReactionModuleSchema
);
