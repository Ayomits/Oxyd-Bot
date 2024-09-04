import { model, Schema } from "mongoose";
import { BaseGuildDocument } from "../../base/GuildDocument";

export interface LoveRoomDocument {
  name: string;
  activity: number;
  createdAt: Date;
}

export enum MarryType {
  LOVE = 1,
  MARRIAGE = 2,
}

export enum MarryLimits {
  LVL_LIMIT = 10,
}

export const xpFormula = (lvl: number) => {
  return lvl * 100; // Пример формулы XP: 100 XP на уровень
}

export interface MarryDocument extends BaseGuildDocument {
  partner1Id: string;
  partner2Id: string;
  type: MarryType;
  lvl: number;
  xp: number;
  createdAt: Date;
  loveroom: LoveRoomDocument;
}

export const MarrySchema = new Schema<MarryDocument>({
  guildId: {
    type: String,
    required: true,
  },
  partner1Id: {
    type: String,
    required: true,
  },
  partner2Id: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  type: {
    type: Number,
    enum: [MarryType.LOVE, MarryType.MARRIAGE],
    default: MarryType.LOVE,
  },
  lvl: {
    type: Number,
    default: 1,
  },
  xp: {
    type: Number,
    default: 0,
  },
  loveroom: {
    name: {
      type: String,
      default: null,
    },
    activity: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
});

export const MarryModel = model<MarryDocument>("guild_marries", MarrySchema);
