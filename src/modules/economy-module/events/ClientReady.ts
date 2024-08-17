import BaseCommand from "@/abstractions/BaseCommand";
import BaseEvent from "@/abstractions/BaseEvent";
import { SnowflakeType } from "@/enums";
import { GuildDocument, GuildModel } from "@/models/GuildsModel";
import { EconomyUserModel } from "@/models/UserModel";
import configService from "@/utils/system/ConfigService";
import Logger from "@/utils/system/Logger";
import { Client, Events, REST, Routes } from "discord.js";
import mongoose from "mongoose";

export class ReadyEvent extends BaseEvent {
  constructor() {
    super({
      name: Events.ClientReady,
      once: true,
    });
  }

  async execute(client: Client) {
    return await Promise.all([this.collectAllUsers(client)]);
  }

  private async collectAllUsers(client: Client) {
    const allNotCreated = [];
    for (const [_, guild] of client.guilds.cache) {
      const dbUsers = (await EconomyUserModel.find({ guildId: guild.id })).map(
        (user) => user.userId
      );
      const notCreated = (await (await guild.fetch()).members.fetch())
        .filter((member) => {
          return !dbUsers.includes(member.id) && !member.user.bot;
        })
        .map((member) => {
          return new EconomyUserModel({ userId: member.id, guildId: guild.id });
        });
      await EconomyUserModel.insertMany(notCreated);
    }
  }
}
