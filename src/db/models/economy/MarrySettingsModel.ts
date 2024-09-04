import { BaseModuleGuildDocument } from "@/db/base/GuildDocument";
import { Snowflake } from "discord.js";

export interface MarrySettings extends BaseModuleGuildDocument {
  loveroomCategory: Snowflake
  marryRole: Snowflake
  loveroomAccess: number
}