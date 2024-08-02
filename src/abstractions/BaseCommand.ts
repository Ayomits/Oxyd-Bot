import { CommandConfig } from "@/types/options";
import { AutocompleteInteraction, CommandInteraction } from "discord.js";

export default abstract class BaseCommand {
  declare readonly options: CommandConfig;
  constructor(options: CommandConfig) {
    this.options = options;
  }
  public execute(_interaction: CommandInteraction) {}
  public autoComplete?(_interaction: AutocompleteInteraction) {}
}
