import { CommandInteraction, EmbedBuilder, User } from "discord.js";

export type ReactionConfig = {
  action: string;
  api_name: string;
  everyone: boolean;
  everyoneVerb: string;
  isApi: boolean;
  memberVerb: string;
  verbal: string;
  type: string;
  isAcceptable: false;
  aliases: string[];
  cost: number;
  message?: string;
  nsfw: boolean;
};

export type Reaction = { [key: string]: ReactionConfig };

export type ReactionLink = { [key: string]: string[] };

export type ApiResponse = {
  data: {
    url: string;
  };
};

export type RepsonseType = {
  embeds: any[];
  content?: string;
  components?: any[];
};

export function findReactionByKeyOrAliases(key: string, conf: ReactionConfig) {
  return conf[key] ? conf[key] : findReactionByAliases(key, conf);
}

export function findReactionByAliases(alias: string, conf: ReactionConfig) {
  for (const key in conf) {
    const reaction = conf[key] as ReactionConfig;
    if (reaction.aliases.includes(alias)) return key;
  }
  return null;
}
