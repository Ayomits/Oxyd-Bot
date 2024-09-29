import { Client, SlashCommandBuilder } from "discord.js";
import reactions from "./configs/react.json";
import { ReactionConfig } from "./ReactionTypes";

export function ReactionCollector(client: Client) {
  const reactionsBuilders = [];
  for (const key in reactions) {
    const reaction = reactions[key] as ReactionConfig;
    const builder = new SlashCommandBuilder()
      .setName(reaction.api_name)
      .setDescription(reaction.action)
      .addUserOption((option) =>
        option
          .setName(`user`)
          .setDescription(`Тот на ком вы хотите применить реакцию`)
          .setRequired(!reaction.everyone)
      );
    reactionsBuilders.push(builder);
  }
  return reactionsBuilders;
}
