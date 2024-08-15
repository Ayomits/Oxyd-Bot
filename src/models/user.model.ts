import { Document, model, Schema } from "mongoose";

// Defining the interface for the EconomyUserDocument
export interface EconomyUserDocument extends Document {
  guildId: string;
  userId: string;
  balance: number;
  xp: number;
  lvl: number;
  status: string;
  marry?: {
    partnerId: string;
    createdAt: Date;
    loveroom?: {
      name: string;
      voiceActivity: number;
    };
  } | null;
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
  marry: {
    type: {
      partnerId: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        required: true,
        default: Date.now,
      },
      loveroom: {
        type: {
          name: {
            type: String,
            required: true,
          },
          voiceActivity: {
            type: Number,
            required: true,
            default: 0,
          },
        },
        required: false,
      },
    },
    default: null,
  },
});

export const EconomyUserModel = model<EconomyUserDocument>(
  "economy_users",
  EconomyUserSchema
);
