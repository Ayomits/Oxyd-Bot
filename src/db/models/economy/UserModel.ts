import { Document, model, Schema } from "mongoose";
import { UserDocument } from "../../base/UserDocument";

// Defining the interface for the EconomyUserDocument
export interface EconomyUserDocument extends UserDocument {
  balance: number;
  xp: number;
  lvl: number;
  status: string;
  birthday: string; // 22.11 ... etc
}

// Defining the Mongoose schema for EconomyUserDocument
export const EconomyUserSchema = new Schema<EconomyUserDocument>({
  guildId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  xp: {
    type: Number,
    default: 0,
  },
  lvl: {
    type: Number,
    default: 1,
  },
  status: {
    type: String,
    default: "Не указано",
  },
  birthday: {
    type: String,
    default: null,
  },
});

export const EconomyUserModel = model<EconomyUserDocument>(
  "economy_users",
  EconomyUserSchema
);
