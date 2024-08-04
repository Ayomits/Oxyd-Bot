import BaseEvent from "@/abstractions/BaseEvent";
import { Events, Guild } from "discord.js";
import GuildService from "./GuildService";
import Logger from "@/utils/system/Logger";

export class GuildCreate extends BaseEvent {
  constructor() {
    super({
      once: false,
      name: Events.GuildCreate,
    });
  }
  async execute(guild: Guild) {
    const existed = await GuildService.findOne(guild.id);
    if (existed) return;
    await GuildService.createBlank(guild.id)
      .then(() => Logger.log(`${guild.id} add server and created in db`))
      .catch((err) => Logger.error(err));
  }
}
