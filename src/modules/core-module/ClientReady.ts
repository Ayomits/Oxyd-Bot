import BaseCommand from "@/abstractions/BaseCommand";
import BaseEvent from "@/abstractions/BaseEvent";
import { SnowflakeType } from "@/enums";
import { GuildDocument, GuildModel } from "@/models/GuildsModel";
import configService from "@/utils/system/ConfigService";
import Logger from "@/utils/system/Logger";
import { ActivityType, Client, Events, REST, Routes, TextChannel } from "discord.js";
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
      this.registerCommand(client),
      this.setStatus(client),
    ]);
  }

  private async connectToDb(): Promise<void> {
    await mongoose.connect(configService.get("MONGODB_URI"));
  }

  private async setStatus(client: Client) {
    const status = async () => {
      let totalMemberCount = 0;
      for (const guild of client.guilds.cache) {
        totalMemberCount += (await guild[1].fetch()).memberCount;
      }
      return client.user.setActivity({
        type: ActivityType.Playing,
        name: ` Участников: ${totalMemberCount}. Серверов: ${client.guilds.cache.size}`,
      });
    };
    await status();
    setInterval(async () => {
      await status();
    }, 60_000);
  }

  private async registerCommand(client: Client) {
    const _developer = [] as BaseCommand[];
    const _public = [] as BaseCommand[];
    const rest = new REST().setToken(client.token);
    client.commands
      .filter((command) => command.options.isSlash)
      .forEach((command) => {
        if (command.options.type === SnowflakeType.Developer) {
          _developer.push(command);
          return;
        }
        _public.push(command);
      });
    try {
      const promises = [];
      promises.push(
        rest.put(Routes.applicationCommands(client.user.id), {
          body: _public.map((command) => command.options.builder.toJSON()),
        })
      );
      if (_developer) {
        for (const guildId of global.testGuilds) {
          try {
            await rest.put(
              Routes.applicationGuildCommands(client.user.id, guildId),
              {
                body: _developer.map((command) =>
                  command.options.builder.toJSON()
                ),
              }
            );
          } catch {}
        }
      }
      await Promise.all(promises);
      Logger.success(`${_public.length} public commands registered`);
      Logger.success(`${_developer.length} developer commands registered`);
    } catch (err) {
      Logger.error(err);
    }
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
