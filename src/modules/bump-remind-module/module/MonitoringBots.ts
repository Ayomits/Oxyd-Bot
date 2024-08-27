import { BumpReminderModuleDocument } from "@/models/BumpReminderModel";

export enum MonitoringBots {
  SDC_MONITORING = "464272403766444044",
  SERVER_MONITORING = "315926021457051650",
  DISCORD_MONITORING = "575776004233232386",
}

export const monitoringKey: {
  [key: string]: keyof BumpReminderModuleDocument;
} = {
  [MonitoringBots.DISCORD_MONITORING]: "discordMonitoring",
  [MonitoringBots.SDC_MONITORING]: "sdc",
  [MonitoringBots.SERVER_MONITORING]: "serverMonitoring",
};

export type Monitoring = string | MonitoringBots;

export const monitoringsArr: string[] = [MonitoringBots.SDC_MONITORING, MonitoringBots.DISCORD_MONITORING, MonitoringBots.SERVER_MONITORING]
export const monitoringDescriptions = {
  [MonitoringBots.DISCORD_MONITORING]: {
    bad: ["You are so hot", "Не так быстро"],
    success: ["Вы успешно лайкнули сервер", "You successfully"]
  },
  [MonitoringBots.SDC_MONITORING]: {
    bad: ["Up"],
    success: ["Успешный Up!"]
  },
  [MonitoringBots.SERVER_MONITORING]: {
    bad: ["The next"],
    success: ["Server bumped by"]
  },
}