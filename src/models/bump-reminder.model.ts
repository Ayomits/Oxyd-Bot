import { Snowflake } from "discord.js";
import { Document } from "mongoose";

export type MonitoringType = {
  latency: number; // кол-во минут перед каждым бампом
  lastReaction: Date;
  next: Date;
};

export interface BumpReminderDocument extends Document {
  guildId: Snowflake;
  pingRoleId: Snowflake;
  pingChannelId: Snowflake;
  enable: boolean; // включить ли напоминания для сервера
  sdc: MonitoringType;
  discordMonitoring: MonitoringType;
  serverMonitoring: MonitoringType;
}
