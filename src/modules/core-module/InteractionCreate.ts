import BaseEvent from "@/abstractions/BaseEvent";
import { SnowflakeType } from "@/enums";
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
          command.options.type === SnowflakeType.Developer &&
          !global.developers.includes(interaction.user.id)
        )
          return;
        if (
          !command.options.allowDms &&
          interaction.channel.id === interaction.user.id
        ) {
          return;
        }
        if (command) {
          command?.execute(interaction);
          Logger.log(`${interaction.commandName} successfully launched`);
        }
      }
      if (interaction.isAutocomplete()) {
        const command = interaction.client.commands.get(
          interaction.commandName
        );
        if (!command) return;
        command?.autoComplete(interaction);
        Logger.success(
          `${interaction.commandName} autocomplete successfully launched`
        );
      }
      if (
        interaction.isButton() ||
        interaction.isAnySelectMenu() ||
        interaction.isModalSubmit()
      ) {
        const splitterRegex = /(?<=_\()[^)]*(?=\))|_/;
        const splitedCustomId = interaction.customId.split(splitterRegex);
        const component = interaction.client.buttons.get(splitedCustomId[0]);

        if (component?.options?.authorOnly) {
          if (interaction.user?.id !== interaction.message?.interaction.user.id)
            return;
        }
        if (component?.options?.ttl) {
          const msgCreated = Math.floor(
            interaction.message.createdTimestamp / 1000
          );
          const now = Math.floor(new Date().getTime() / 1000);
          if (now > msgCreated + component.options.ttl) return;
        }
        if (interaction.isStringSelectMenu()) {
          const value = interaction.values[0].split(splitterRegex);
          const valueCallback = interaction.client.values.get(value[0]);
          if (valueCallback) {
            try {
              valueCallback.execute(interaction, value.slice(1));
              Logger.log(
                `value ${value[0]} launched for select menu ${splitedCustomId[0]}`
              );
              return;
            } catch (err) {
              Logger.error(err);
            }
          }
        }
        try {
          component?.execute(interaction, splitedCustomId.slice(1));
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
