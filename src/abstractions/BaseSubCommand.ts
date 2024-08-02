import { SubCommandConfig } from "@/types/options";
import { AutocompleteInteraction, CommandInteraction } from "discord.js";

export default abstract class BaseSubCommand {
  declare readonly options: SubCommandConfig;
  constructor(options: SubCommandConfig) {
    this.options = options;
  }
  public async autoComplete(_interaction: AutocompleteInteraction) {}
  public async execute(_interaction: CommandInteraction) {}
}
