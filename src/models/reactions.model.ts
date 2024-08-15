import { Document, model, Schema } from "mongoose";

export interface ReactionModuleDocument extends Document {
  guildId: string;
  enable: boolean;
  nsfwReactions: string[];
  commonReactions: string[];
}

export const ReactionModuleSchema = new Schema<ReactionModuleDocument>({
  guildId: {
    type: String,
    required: true,
  },
  enable: {
    type: Boolean,
    default: true,
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
});

export const ReactionModuleModel = model<ReactionModuleDocument>(
  "reaction_module",
  ReactionModuleSchema
);
