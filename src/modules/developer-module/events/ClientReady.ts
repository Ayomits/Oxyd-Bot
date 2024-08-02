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
  }

  private async registerCommand(client: Client) {
    const _developer = [];
    const _public = [];
    const rest = new REST().setToken(client.token);
    client.commands.forEach((command) => {
      if (command.options.type === SnowflakeType.Developer) {
        _developer.push(command);
        return;
      }
      _public.push(command);
    });
    try {
      await rest.put(Routes.applicationCommands(client.user.id));
    } catch {}
  }
}
