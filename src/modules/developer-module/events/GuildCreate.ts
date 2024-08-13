import BaseEvent from "@/abstractions/BaseEvent";
import { GuildModel } from "@/models/guilds.model";
import { Events, Guild } from "discord.js";

export class GuildCreate extends BaseEvent {
  constructor() {
    super({
      name: Events.GuildCreate,
      once: false,
    });
  }

  public async execute(guild: Guild): Promise<void> {
    await GuildModel.create({ guildId: guild.id });
  }
}
