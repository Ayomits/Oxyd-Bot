import { Document, model, Schema } from "mongoose";

export interface ClansDocument extends Document {
  guildId: string;
  ownerId: string;
  name: string;
  iconUrl: string;
  description: string;
  coOwners: string[];
  members: string[];
}
export const ClansSchema = new Schema<ClansDocument>({
  guildId: {
    type: String,
    required: true,
  },
  ownerId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },  
  iconUrl: {
    type: String,
    required: false,
    default: null,
  },
  description: {
    type: String,
    required: false,
    default: "Не указано",
  },
  coOwners: {
    type: [],
    default: [],
  },
  members: {
    type: [],
    default: [],
  },
});
export const ClansModel = model<ClansDocument>(`economy_clans`, ClansSchema);
