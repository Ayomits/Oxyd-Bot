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
  resposeFunc: any,
  deferUpdate = true,
  mustEphemeral = true
) {
  if (deferUpdate) {
    await interaction.deferUpdate();
  } else await interaction.deferReply({ ephemeral: mustEphemeral });
  interaction.editReply(await resposeFunc(interaction));
}
