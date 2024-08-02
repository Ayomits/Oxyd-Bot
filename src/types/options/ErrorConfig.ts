import {
  AnySelectMenuInteraction,
  ButtonInteraction,
  ColorResolvable,
  CommandInteraction,
  ModalSubmitInteraction,
} from "discord.js";

export type ErrorConfig = {
  description: string;
  title: string;
  color: ColorResolvable;
  interaction:
    | CommandInteraction
    | AnySelectMenuInteraction
    | ButtonInteraction
    | ModalSubmitInteraction;
  isMustReply?: boolean;
  ephemeral?: boolean
};