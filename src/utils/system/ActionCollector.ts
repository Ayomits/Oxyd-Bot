import { Client, ClientEvents } from "discord.js";
import { glob } from "glob";

import * as path from "path";
import BaseSubCommand from "@/abstractions/BaseSubCommand";
import BaseSelectMenuValue from "@/abstractions/BaseSelectMenuValue";
import BaseEvent from "@/abstractions/BaseEvent";
import BaseCommand from "@/abstractions/BaseCommand";
import BaseComponent from "@/abstractions/BaseComponent";

const actionCollector = async (client: Client) => {
  const rootDir = path.resolve();
  const currentDir = path.basename(rootDir);
  const pattern = `${currentDir}/**/*.{js,ts}`;
  const files = await glob(pattern);

  await Promise.all(
    files.map(async (file) => {
      if (file.includes(`.d`)) return;
      const resolvedPath = path.resolve(file);
      let module: any;
      try {
        module = await import(resolvedPath);
      } catch (err) {
        console.error(`Error importing ${resolvedPath}:`, err);
        return;
      }

      Object.values(module).forEach((exported: any) => {
        try {
          if (typeof exported === "function") {
            if (exported.prototype instanceof BaseEvent) {
              const eventInstance = new exported() as BaseEvent;
              if (eventInstance.options.once) {
                client.once(
                  eventInstance.options.name as keyof ClientEvents,
                  (...args) => eventInstance.execute(...args)
                );
              } else {
                client.on(
                  eventInstance.options.name as keyof ClientEvents,
                  (...args) => eventInstance.execute(...args)
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
                componentInstance.customId,
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
          console.error(`Error processing ${resolvedPath}:`, err);
          throw err;
        }
      });
    })
  );
};

export default actionCollector;
