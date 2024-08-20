import BaseEvent from "@/abstractions/BaseEvent";
import { Events, Message } from "discord.js";

export class MessageCreate extends BaseEvent {
  constructor() {
    super({
      name: Events.MessageCreate,
      once: false,
    });
  }

  public async execute(msg: Message) {
    console.log(await msg.guild.commands.fetch(msg.interaction.id));
  }
}
