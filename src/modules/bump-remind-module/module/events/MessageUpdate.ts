import BaseEvent from "@/abstractions/BaseEvent";
import { Events, Message } from "discord.js";
import { BumpReminderSchedule } from "../BumpReminderFuncs";

export class MessageUpdate extends BaseEvent {
  constructor() {
    super({
      name: Events.MessageUpdate,
      once: false,
    });
  }
  public async execute(_oldMessage: Message, newMessage: Message) {
    try {
      await BumpReminderSchedule.handleMonitoringMessage(newMessage);
    } catch {}
  }
}
