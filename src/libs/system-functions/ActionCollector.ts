import { Client, ClientEvents } from "discord.js";
import { glob } from "glob";
import BaseSubCommand from "@/abstractions/BaseSubCommand";
import BaseSelectMenuValue from "@/abstractions/BaseSelectMenuValue";
import BaseEvent from "@/abstractions/BaseEvent";
import BaseCommand from "@/abstractions/BaseCommand";
import BaseComponent from "@/abstractions/BaseComponent";
import * as path from "path";
import Logger from "@/libs/core-functions/Logger";


const actionCollector = async (client: Client) => {
  const currentDir = path.basename(global.rootDir);
  const pattern = `${currentDir}/**/*{.ts,.js}`;
  const files = await glob(pattern);
  await Promise.all(
    files.map(async (file) => {
      if (file.includes(`.d`)) return;
      const resolvedPath = path.resolve(file);
      let module: any;
      try {
        module = await import(resolvedPath);
      } catch (err) {
        Logger.error(`Error importing ${resolvedPath}:`, err);
        return;
      }

      Object.values(module).forEach((exported: any) => {
        try {
          if (typeof exported === "function") {
            if (exported.prototype instanceof BaseEvent) {
              const eventInstance = new exported() as BaseEvent;
              const eventName = eventInstance.options.name;

              if (eventInstance.options.once) {
                Logger.log(`${eventName} (once) event was launched`);
                client.once(eventName as keyof ClientEvents, (...args) =>
                  eventInstance.execute(...args)
                );
              } else {
                Logger.log(`${eventName} (on) event was launched`);
                client.on(eventName as keyof ClientEvents, (...args) =>
                  eventInstance.execute(...args)
                );
              }
            } else if (exported.prototype instanceof BaseCommand) {
              const commandInstance = new exported() as BaseCommand;
              client.commands?.set(
                commandInstance.options.builder.name,
                commandInstance
              );
            } else if (exported.prototype instanceof BaseComponent) {
              const componentInstance = new exported() as BaseComponent;
              client.buttons?.set(
                componentInstance.options.customId,
                componentInstance
              );
            } else if (exported.prototype instanceof BaseSubCommand) {
              const subCommandInstance = new exported() as BaseSubCommand;
              client.subCommands.set(
                `${subCommandInstance.options.parentName}-${subCommandInstance.options.name}`,
                subCommandInstance
              );
            } else if (exported.prototype instanceof BaseSelectMenuValue) {
              const valueCallback = new exported() as BaseSelectMenuValue;
              client.values.set(`${valueCallback.value}`, valueCallback);
            }
          }
        } catch (err) {
          Logger.error(`Error processing ${resolvedPath}:`, err);
          throw err;
        }
      });
    })
  );
};

export default actionCollector;
