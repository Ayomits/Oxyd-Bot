import BaseEvent from "@/abstractions/BaseEvent";
import { Events, Message } from "discord.js";
import { MessageDelete } from "./MessageDelete";

export class MessageDeleteBulk extends BaseEvent {
  constructor() {
    super({
      name: Events.MessageBulkDelete,
      once: false,
    });
  }

  async execute(messages: Message[]) {
    const promises = []
    for (const message of messages) {
      promises.push(new MessageDelete().execute(message))
    }
    return await Promise.all(promises)
  }
}
