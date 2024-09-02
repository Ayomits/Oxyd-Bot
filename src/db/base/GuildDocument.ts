import { Document } from "mongoose";

export interface BaseGuildDocument extends Document {
  guildId: string
}

export interface BaseModuleGuildDocument extends BaseGuildDocument {
  enable: boolean
}