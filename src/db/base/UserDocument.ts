import { Document } from "mongoose";
import { BaseGuildDocument } from "./GuildDocument";

export interface UserDocument extends BaseGuildDocument {
  userId: string
}