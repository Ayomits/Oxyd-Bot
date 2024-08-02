import BaseEvent from "@/abstractions/BaseEvent";
import Logger from "@/utils/system/Logger";
import { Events, Interaction } from "discord.js";

export class InteractionCreate extends BaseEvent {
  constructor() {
    super({
      once: false,
      name: Events.InteractionCreate,
    });
  }

  public async execute(interaction: Interaction) {
    try {
      if (interaction.isCommand()) {
        const command = interaction.client.commands.get(
          interaction.commandName
        );
        if (!command) return;
        if (
          !command.options.allowDms &&
          interaction.channel.id === interaction.user.id
        ) {
          return;
        }
        await command!.execute(interaction);
        Logger.log(`${interaction.commandName} successfully launched`);
      }
      if (interaction.isAutocomplete()) {
        const command = interaction.client.commands.get(
          interaction.commandName
        );
        if (!command) return;
        await command?.autoComplete(interaction);
        Logger.success(
          `${interaction.commandName} autocomplete successfully launched`
        );
      }
      if (
        interaction.isButton() ||
        interaction.isAnySelectMenu() ||
        interaction.isModalSubmit()
      ) {
        const splitedCustomId = interaction.customId.split("_");
        const component = interaction.client.buttons.get(splitedCustomId[0]);
        if (!component) return;
        return component!.execute(interaction, splitedCustomId.slice(1));
      }
    } catch (err) {
      Logger.error(err);
    }
  }
}
