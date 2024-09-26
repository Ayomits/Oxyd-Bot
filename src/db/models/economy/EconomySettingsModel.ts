import { BaseModuleGuildDocument } from "@/db/base/GuildDocument";
import { model, Schema } from "mongoose";

export interface EconomySettingsDocument extends BaseModuleGuildDocument {
  currencyEmoji: string;
  voiceRates: number;
  messageRates: number;
  currencyCases: {
    singular: {
      nominative: string;
      genitive: string;
      dative: string;
      accusative: string;
      instrumental: string;
    };
    plural: {
      nominative: string;
      genitive: string;
      dative: string;
      accusative: string;
      instrumental: string;
    };
  };
  categories: string[];
  ignoredChannels: string[];
}

export const EconomySettingsSchema = new Schema<EconomySettingsDocument>({
  guildId: {
    type: String,
    required: true,
  },
  enable: {
    type: Boolean,
    default: false,
  },
  currencyEmoji: {
    type: String,
    required: false,
    default: "💵",
  },
  categories: {
    type: [],
    default: [],
  },
  messageRates: {
    type: Number,
    default: 0.25,
  },
  voiceRates: {
    type: Number,
    default: 1,
  },
  ignoredChannels: {
    type: [],
    default: [],
  },
  currencyCases: {
    singular: {
      nominative: {
        type: String,
        required: true,
        default: `оксид`,
      },
      genitive: {
        type: String,
        required: true,
        default: "оксид",
      },
      dative: {
        type: String,
        required: true,
        default: "оксидам",
      },
      accusative: {
        type: String,
        required: true,
        default: "оксид",
      },
      instrumental: {
        type: String,
        required: true,
        default: "оксидом",
      },
    },
    plural: {
      nominative: {
        type: String,
        required: true,
        default: `оксиды`,
      },
      genitive: {
        type: String,
        required: true,
        default: "оксидов",
      },
      dative: {
        type: String,
        required: true,
        default: "оксидам",
      },
      accusative: {
        type: String,
        required: true,
        default: "оксиды",
      },
      instrumental: {
        type: String,
        required: true,
        default: "оксидами",
      },
    },
  },
});

export const EconomySettingsModel = model<EconomySettingsDocument>(
  "guild_economy_settings",
  EconomySettingsSchema
);
