import BaseEvent from "@/abstractions/BaseEvent";
import Logger from "@/utils/system/Logger";
import {
  ButtonInteraction,
  ChannelSelectMenuInteraction,
  Events,
  Interaction,
  ModalSubmitInteraction,
  RoleSelectMenuInteraction,
  StringSelectMenuInteraction,
  UserSelectMenuInteraction,
  AnySelectMenuInteraction,
} from "discord.js";

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
        if (component.ttl) {
          const msgCreated = Math.floor(
            interaction.message.createdTimestamp / 1000
          );
          const now = Math.floor(new Date().getTime() / 1000);
          if (msgCreated - now <= component.ttl) return;
        }
        if (interaction.isAnySelectMenu()) {
          const value = interaction.values[0].split("_");
          const valueCallback = interaction.client.values.get(value[0]);
          if (valueCallback) {
            try {
              valueCallback.execute(interaction, value.slice(1));
              Logger.log(
                `value ${value} launched for select menu ${splitedCustomId[0]}`
              );
              return;
            } catch (err) {
              Logger.error(err);
            }
          }
        }
        try {
          component!.execute(interaction, splitedCustomId.slice(1));
          Logger.log(
            `${interaction.customId} ${this.componentCalc(
              interaction
            )} component launched`
          );
        } catch (err) {
          Logger.error(err);
        }
      }
    } catch (err) {
      Logger.error(err);
    }
  }

  private componentCalc(interaction: any) {
    if (interaction instanceof ButtonInteraction) return "button";
    if (interaction instanceof StringSelectMenuInteraction)
      return "string select";
    if (interaction instanceof RoleSelectMenuInteraction) return "role select";
    if (interaction instanceof ChannelSelectMenuInteraction)
      return "channel select";
    if (interaction instanceof UserSelectMenuInteraction) return "user select";
    if (interaction instanceof ModalSubmitInteraction) return "modal";
    return "";
  }
}
