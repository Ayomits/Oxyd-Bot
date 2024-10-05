import { Guild } from "discord.js";

export async function fetchSafe(userId: string, guild: Guild) {
  try {
    const member = await guild.members.fetch(userId);
    return member;
  } catch {
    return null;
  }
}