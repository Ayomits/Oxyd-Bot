import { ComponentOptions } from "@/types/options/ComponentConfig";
import {
  AnySelectMenuInteraction,
  ButtonInteraction,
  ChannelSelectMenuInteraction,
  ModalSubmitInteraction,
  RoleSelectMenuInteraction,
  StringSelectMenuInteraction,
} from "discord.js";

export default abstract class BaseComponent {
  declare readonly options: ComponentOptions;
  constructor(options: ComponentOptions) {
    this.options = options;
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
