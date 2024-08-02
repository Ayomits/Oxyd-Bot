import {
  AnySelectMenuInteraction,
  ChannelSelectMenuInteraction,
  RoleSelectMenuInteraction,
  StringSelectMenuInteraction,
  UserSelectMenuInteraction,
} from "discord.js";

export default abstract class BaseSelectMenuValue {
  declare readonly value: string;
  public async execute(
    _interaction:
      | StringSelectMenuInteraction
      | RoleSelectMenuInteraction
      | ChannelSelectMenuInteraction
      | UserSelectMenuInteraction
      | AnySelectMenuInteraction
  ): Promise<any> {}
}
