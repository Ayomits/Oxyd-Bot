import BaseCommand from "@/abstractions/BaseCommand";
import { SnowflakeType } from "@/enums";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export class ReactionHelpCommand extends BaseCommand {
  constructor() {
    super({
      type: SnowflakeType.Everyone,
      isSlash: true,
      builder: new SlashCommandBuilder()
        .setName(`reaction-help`)
        .setDescription(`Документация по реакциям`)
        .addStringOption((option) =>
          option
            .setName(`name`)
            .setDescription(`Название реакции`)
            .setRequired(false)
        ),
    });
  }

  public execute(interaction: CommandInteraction) {
    const reactionName = interaction.options.get("name")?.value as string;
    if (!reactionName) {
      
    } else {
      
    }
  }
}
