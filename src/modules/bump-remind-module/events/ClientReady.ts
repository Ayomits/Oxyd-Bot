import BaseEvent from "@/abstractions/BaseEvent";
import {
  BumpReminderModuleDocument,
  BumpReminderModuleModel,
  MonitoringType,
} from "@/models/BumpReminderModel";
import { Client, Events, Guild } from "discord.js";
import moment from "moment-timezone";
import { BumpReminderSchedule } from "../BumpReminderFuncs";
import { Monitoring, MonitoringBots } from "../MonitoringBots";
import { scheduledJobs } from "node-schedule";

export class BumpClientReady extends BaseEvent {
  constructor() {
    super({
      name: Events.ClientReady,
      once: false,
    });
  }

  public async execute(client: Client) {
    const bumpSettings = await BumpReminderModuleModel.find({
      guildId: { $in: client.guilds.cache.map((guild) => guild.id) },
    });

    for (const bumpSetting of bumpSettings) {
      const { sdc, discordMonitoring, serverMonitoring } = bumpSetting;
      const guild = client.guilds.cache.get(bumpSetting.guildId);
      if (!guild) continue;

      await Promise.all([
        this.checkTime(guild, MonitoringBots.SDC_MONITORING, sdc, "sdc"),
        this.checkTime(
          guild,
          MonitoringBots.DISCORD_MONITORING,
          discordMonitoring,
          "discordMonitoring"
        ),
        this.checkTime(
          guild,
          MonitoringBots.SERVER_MONITORING,
          serverMonitoring,
          "serverMonitoring"
        ),
      ]);
    }
  }

  private checkTime(
    guild: Guild,
    monitoring: Monitoring,
    dbMonitoring: MonitoringType,
    key: keyof BumpReminderModuleDocument
  ) {
    const now = Date.now();
    const GMTTime = moment(dbMonitoring.next).tz("Europe/Moscow");
    if (GMTTime.isAfter(now)) {
      BumpReminderSchedule.setSchedule(
        guild,
        monitoring,
        GMTTime.toDate(),
        key
      );
    }
  }
}
