import { BumpReminderModuleDocument } from "@/models/BumpReminderModel";
import { Message } from "discord.js";

export enum MonitoringBots {
  SDC_MONITORING = "464272403766444044",
  SERVER_MONITORING = "315926021457051650",
  DISCORD_MONITORING = "575776004233232386",
}
export type Monitoring = string | MonitoringBots;

export type MonitoringBotsObjectType = {
  id: string
  bad: string[];
  success: string[];
  command: string;
  timestampFetcher: (msg: Message) => Date | number | string;
  dbKey: keyof BumpReminderModuleDocument;
};

export type MonitoringBotsObjsType = {
  [key: MonitoringBots | string]: MonitoringBotsObjectType;
};

export const MonitoringBotsObjs: MonitoringBotsObjsType = {
  [MonitoringBots.DISCORD_MONITORING]: {
    id: MonitoringBots.DISCORD_MONITORING,
    bad: ["You are so hot", "Не так быстро"],
    success: ["Вы успешно лайкнули сервер", "You successfully"],
    command: "/like",
    timestampFetcher: (msg: Message) => {
      return "";
    },
    dbKey: "discordMonitoring",
  },
  [MonitoringBots.SDC_MONITORING]: {
    id: MonitoringBots.SDC_MONITORING,
    bad: ["Up"],
    success: ["Успешный Up!"],
    command: "/up",
    timestampFetcher: (msg: Message) => {
      return "";
    },
    dbKey: "sdc",
  },
  [MonitoringBots.SERVER_MONITORING]: {
    id: MonitoringBots.SERVER_MONITORING,
    bad: ["The next"],
    success: ["Server bumped by"],
    command: "/bump",
    timestampFetcher: (msg: Message) => {
      return "";
    },
    dbKey: "serverMonitoring",
  },
};
