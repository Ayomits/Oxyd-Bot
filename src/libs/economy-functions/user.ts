
import { EconomyUserDocument, EconomyUserModel } from "@/db/models/economy/UserModel";
import { Snowflake } from "discord.js";
import { Types } from "mongoose";

export class EconomyUserActions {
  private guildId: Snowflake;
  private userId: Snowflake;
  private cache: Map<string, Types.ObjectId> = new Map();

  constructor(guildId: Snowflake, userId: Snowflake) {
    this.guildId = guildId;
    this.userId = userId;
  }

  public async fetch() {
    return await EconomyUserModel.findOne({
      userId: this.userId,
      guildId: this.guildId,
    });
  }

  public async addXp(amount: number, existed?: EconomyUserDocument) {
    const query = {
      $inc: {
        xp: amount,
      },
    };
    await this.baseUpdater(query, existed);
    return this;
  }

  // set xp to 0
  public async addLvl(amount: number, existed?: EconomyUserDocument) {
    const query = {
      $inc: {
        lvl: amount,
      },
      $set: {
        xp: 0,
      },
    };
    await this.baseUpdater(query, existed);
    return this;
  }

  public addBalance(amount: number, existed?: EconomyUserDocument) {
    const query = {
      $inc: {
        xp: amount,
      },
    };
    this.baseUpdater(query, existed);
    return this;
  }

  public setStatus(status: string, existed?: EconomyUserDocument) {
    const query = {
      $set: {
        status: status,
      },
    };
    this.baseUpdater(query, existed);
    return this;
  }

  public removeXp(amount: number, existed?: EconomyUserDocument) {
    const query = {
      $inc: {
        xp: -amount,
      },
    };
    this.baseUpdater(query, existed);
    return this;
  }

  public async removeBalance(amount: number, existed?: EconomyUserDocument) {
    const query = {
      $inc: {
        balance: -amount,
      },
    };
    this.baseUpdater(query, existed);
    return this;
  }

  public async removeLvl(amount: number, existed?: EconomyUserDocument) {
    const query = {
      $inc: {
        lvl: -amount,
      },
    };
    this.baseUpdater(query, existed);
    return this;
  }

  private async updateByObjectId(objectId: any, query: any) {
    await EconomyUserModel.findOneAndUpdate(objectId, query);
    return this;
  }

  private async baseUpdater(query: any, existed?: EconomyUserDocument) {
    const cacheKey = `${this.userId}-${this.guildId}`;
    const cachedUser = this.cache.get(cacheKey);
    if (cachedUser) {
      return await this.updateByObjectId(cachedUser, query);
    }
    let user;
    if (!existed) {
      user = await this.fetch();
      user.updateOne(query);
    } else {
      existed.updateOne(query);
    }
    this.cache.set(cacheKey, (existed._id || user._id) as Types.ObjectId);
    return this;
  }
}
