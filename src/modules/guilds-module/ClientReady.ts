import BaseEvent from "@/abstractions/BaseEvent";
import { Client, Events } from "discord.js";
import Logger from "@/utils/system/Logger";
import prisma from "@prisma";
import { SnowflakeType } from "@/enums";
import GuildService from "./GuildService";

export class GuildClientReady extends BaseEvent {
  constructor() {
    super({
      once: true,
      name: Events.ClientReady,
    });
  }

  public async execute(client: Client) {
    try {
      const dbGuilds = await GuildService.findAll();
      const mappedGuilds = dbGuilds.map((guild) => guild.id);
      const notCreatedGuilds = client.guilds.cache.filter(
        (guild) => !mappedGuilds.includes(guild.id)
      );
      for (const guild of notCreatedGuilds.values()) {
        await GuildService.createBlank(guild.id).then(() => Logger.log(`Guild ${guild.name} was created in DB`));
      }
      Logger.log(
        `Added ${notCreatedGuilds.size} new guild(s) to the database.`
      );
    } catch (error) {
      Logger.error(error);
    }
  }
}
