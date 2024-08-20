import BaseEvent from "@/abstractions/BaseEvent";
import { Events, GuildMember } from "discord.js";
import { MonitoringBots } from "../MonitoringBots";
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
    if (isEnum(member.id, MonitoringBots)) {
      BumpReminderSchedule.removeSchedule(member.guild, member.id);
    }
  }
}
