import BaseEvent from "@/abstractions/BaseEvent";
import { Events, GuildMember } from "discord.js";
import { MonitoringBots, MonitoringBotsObjs } from "../MonitoringBots";
import { isEnum } from "class-validator";
import { BumpReminderSchedule } from "../BumpReminderFuncs";

export class BumpGuildMemberRemove extends BaseEvent {
  constructor() {
    super({
      name: Events.GuildMemberRemove,
      once: false,
    });
  }

  public async execute(member: GuildMember) {
    if (MonitoringBotsObjs[member.id]) {
      BumpReminderSchedule.removeSchedule(member.guild, member?.id as string);
    }
  }
}
