import { ButtonStyle } from "discord.js";

export function buttonStyle(flag: boolean) {
  return flag ? ButtonStyle.Danger : ButtonStyle.Success;
}
