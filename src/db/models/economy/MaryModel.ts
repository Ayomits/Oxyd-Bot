import { model, Schema } from "mongoose";
import { BaseGuildDocument } from "../../base/GuildDocument";

export interface LoveRoomDocument {
  name: string; // default: partner1.username❤partner2.username
  activity: number; // seconds
}

export interface MarryDocument extends BaseGuildDocument {
  partner1Id: string;
  partner2Id: string;
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
  loveroom: {
    name: {
      type: String,
      default: null,
    },
    activity: {
      type: Number,
      default: 0,
    },
  },
});

export const MarryModel = model<MarryDocument>("guild_marries", MarrySchema);
