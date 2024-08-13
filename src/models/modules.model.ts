import { Document, model, Schema } from "mongoose";

export interface ModulesDocument extends Document {
  guildId: string;
  reaction: boolean;
}

export const ModulesSchema = new Schema<ModulesDocument>({
  guildId: {
    type: String,
    required: true,
  },
  reaction: {
    type: Boolean,
    default: false,
  },
});

export const ModulesModule = model<ModulesDocument>("guild_modules", ModulesSchema)
