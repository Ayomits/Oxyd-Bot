import { model, Schema } from "mongoose";
import { BaseGuildDocument } from "../../base/GuildDocument";
import { MarryType } from "@/modules/entartaiment/marry-module/module/configs";

export interface LoveRoomDocument {
  name: string;
  activity: number;
  createdAt: Date;
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
    enum: [MarryType.LOVE, MarryType.MARRIAGE, MarryType.FRIENDS],
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
