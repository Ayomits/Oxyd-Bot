import {
  AnySelectMenuInteraction,
  ButtonInteraction,
  ChannelSelectMenuInteraction,
  ModalSubmitInteraction,
  RoleSelectMenuInteraction,
  StringSelectMenuInteraction,
} from "discord.js";

export default abstract class BaseComponent {
  declare readonly customId: string;
  constructor(customId: string) {
    this.customId = customId;
  }
  execute(
    _interaction:
      | ButtonInteraction
      | ModalSubmitInteraction
      | StringSelectMenuInteraction
      | RoleSelectMenuInteraction
      | ChannelSelectMenuInteraction
      | AnySelectMenuInteraction,
    _args?: string[]
  ) {}
}
