import BaseEvent from "@/abstractions/BaseEvent";
import { Events, GuildMember } from "discord.js";
import { MonitoringBots, monitoringsArr } from "../MonitoringBots";
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
    if (monitoringsArr.includes(member.id)) {
      console.log(`includes `)
      BumpReminderSchedule.removeSchedule(member.guild, member.id);
    }
  }
}
