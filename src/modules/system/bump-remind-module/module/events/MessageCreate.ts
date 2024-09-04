import BaseEvent from "@/abstractions/BaseEvent";
import { Events, Message } from "discord.js";
import { BumpReminderSchedule } from "../BumpReminderFuncs";

export class MessageCreate extends BaseEvent {
  constructor() {
    super({
      name: Events.MessageCreate,
      once: false,
    });
  }

  public async execute(msg: Message) {
    try{
      await BumpReminderSchedule.handleMonitoringMessage(msg)
    }catch{}
  }
}
