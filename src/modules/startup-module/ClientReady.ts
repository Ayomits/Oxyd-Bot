import BaseEvent from "@/abstractions/BaseEvent";
import { GuildDocument, GuildModel } from "@/models/guilds.model";
import configService from "@/utils/system/ConfigService";
import Logger from "@/utils/system/Logger";
import { Client, Events } from "discord.js";
import mongoose from "mongoose";

export class ReadyEvent extends BaseEvent {
  constructor() {
    super({
      name: Events.ClientReady,
      once: true,
    });
  }

  async execute(client: Client) {
    return await Promise.all([
      this.connectToDb()
        .then(() => Logger.log(`Successfully connect to db`))
        .catch((err) => Logger.error(err)),
      this.insertNotCreatedGuilds(client)
        .then((guilds) => `${guilds.length} added to db`)
        .catch((err) => Logger.error(err)),
    ]);
  }

  private async connectToDb(): Promise<void> {
    await mongoose.connect(configService.get("MONGODB_URI"));
  }

  private async insertNotCreatedGuilds(
    client: Client
  ): Promise<GuildDocument[]> {
    const allDbGuild = (await GuildModel.find()).map((guild) => guild.guildId);
    const notCreated = client.guilds.cache
      .filter((guild) => !allDbGuild.includes(guild.id))
      .map((guild) => {
        return new GuildModel({
          guildId: guild.id,
        });
      });
    return await GuildModel.insertMany(notCreated);
  }
}
