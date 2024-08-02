import BaseCommand from "@/abstractions/BaseCommand";
import BaseEvent from "@/abstractions/BaseEvent";
import { SnowflakeType } from "@/enums/SnowflakeType";
import Logger from "@/utils/system/Logger";
import { Client, Events, REST, Routes } from "discord.js";

export class ClientReadyEvent extends BaseEvent {
  constructor() {
    super({
      once: true,
      name: Events.ClientReady,
    });
  }

  async execute(client: Client) {
    Logger.success(`${client.user.username} is launched`);
    this.registerCommand(client);
    Logger.log(`Startup websocket ping: ${client.ws.ping}`)
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
          promises.push(
            rest.put(Routes.applicationGuildCommands(client.user.id, guildId), {
              body: _developer.map((command) =>
                command.options.builder.toJSON()
              ),
            })
          );
        }
      }
      await Promise.all(promises);
      Logger.success(`${_public.length} public commands registered`);
      Logger.success(`${_developer.length} developer commands registered`);
    } catch (err) {
      Logger.error(err);
    }
  }
}
