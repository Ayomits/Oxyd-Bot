import {
  EconomyUserDocument,
  EconomyUserModel,
} from "@/db/models/economy/UserModel";
import { Types } from "mongoose";

export class EconomyUserActions {
  private guildId: string;
  private userId: string;
  private cache: Map<Types.ObjectId, EconomyUserDocument> = new Map();

  constructor(guildId: string) {
    this.guildId = guildId;
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
    return this.baseUpdater(query, existed);
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
    return this.baseUpdater(query, existed);
  }

  public async addBalance(amount: number, existed?: EconomyUserDocument) {
    const query = {
      $inc: {
        xp: amount,
      },
    };
    return this.baseUpdater(query, existed);
  }

  public async setStatus(status: string, existed?: EconomyUserDocument) {
    const query = {
      $set: {
        status: status,
      },
    };
    return this.baseUpdater(query, existed);
  }

  private async baseUpdater(query: any, existed?: EconomyUserDocument) {
    if (!existed) {
      const user = await this.fetch();
      user.updateOne(query);
    } else {
      existed.updateOne(query);
    }
    return this;
  }
}
