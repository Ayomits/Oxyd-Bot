import { EmbedBuilder } from "@discordjs/builders";
import { ActionRowBuilder, Embed } from "discord.js";

interface IResponse {
  embeds: EmbedBuilder[];
  components: ActionRowBuilder[];
  files: any[];
  content: string | null;
}

/**
 * Функция служит для обработки кнопки: "refresh"
 */
export async function SetResponseTo(
  interaction: any,
  resposeFunc: any
) {
  await interaction.deferUpdate();
  interaction.editReply(await resposeFunc(interaction));
}
