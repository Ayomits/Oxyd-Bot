import { Client, Collection, GatewayIntentBits, Options } from "discord.js";
import * as path from "path";

import BaseSubCommand from "@/abstractions/BaseSubCommand";
import BaseCommand from "@/abstractions/BaseCommand";
import BaseComponent from "@/abstractions/BaseComponent";
import BaseSelectMenuValue from "@/abstractions/BaseSelectMenuValue";

import i18n from "@/i18n/i18n-instance";
import configService from "@/utils/system/ConfigService";
import actionCollector from "@/utils/system/ActionCollector";
import Logger from "./utils/system/Logger";

declare module "discord.js" {
  export interface Client {
    commands?: Collection<string, BaseCommand>;
    buttons?: Collection<string, BaseComponent>;
    subCommands?: Collection<string, BaseSubCommand>;
    values?: Collection<string, BaseSelectMenuValue>;
  }
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildIntegrations,
  ],
  makeCache: Options.cacheWithLimits({
    ...Options.DefaultMakeCacheSettings,
    ReactionManager: 0,
    GuildEmojiManager: 0,
    GuildScheduledEventManager: 0,
    GuildStickerManager: 0,
    PresenceManager: 0,
    ThreadManager: 0,
    DMMessageManager: 0,
    GuildInviteManager: 0,
    StageInstanceManager: 0,
  }),
});

global.rootDir = path.resolve(__dirname);
global.testGuilds = ["1268160506623950868"];
global.developers = ["1129162686194790572", "1043515070153494538", "1140333208467152916"];

client.commands = new Collection<string, BaseCommand>();
client.subCommands = new Collection<string, BaseSubCommand>();
client.buttons = new Collection<string, BaseComponent>();
client.values = new Collection<string, BaseSelectMenuValue>();

async function bootstrap() {
  try {
    await actionCollector(client).then(() =>
      Logger.success(`All bot actions successfully collected to cache`)
    );
    await i18n
      .init()
      .then(() => Logger.success(`i18n successfully initialize`));
    client
      .login(configService.get("TOKEN"))
      .then(() => Logger.success(`loggined`));
  } catch (err) {
    Logger.error(err);
  }
}

bootstrap();

process.on("exit", (reason: string) => {
  Logger.log(`Bot stopped: ${reason}`);
});
process.on("uncaughtException", (err) => {
  Logger.error(err);
});
