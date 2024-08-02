import { Client, Collection, GatewayIntentBits } from "discord.js";
import configService from "@utils/system/ConfigService";
import actionCollector from "@utils/system/ActionCollector";
import BaseSubCommand from "@/abstractions/BaseSubCommand";
import BaseCommand from "@/abstractions/BaseCommand";
import BaseComponent from "@/abstractions/BaseComponent";
import BaseSelectMenuValue from "@/abstractions/BaseSelectMenuValue";

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
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection<string, BaseCommand>(); // Команды
client.subCommands = new Collection<string, BaseSubCommand>();
client.buttons = new Collection<string, BaseComponent>(); // Кнопки, селекты, модалки и т.п.
client.values = new Collection<string, BaseSelectMenuValue>();

async function bootstrap() {
  actionCollector(client);
  client.login(configService.get("TOKEN"));
}

bootstrap();
