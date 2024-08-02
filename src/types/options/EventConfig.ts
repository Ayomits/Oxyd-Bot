import { Events } from "discord.js";

export type EventConfig = {
  name: Events;
  once: boolean;
};