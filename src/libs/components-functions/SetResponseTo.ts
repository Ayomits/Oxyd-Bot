import { EmbedBuilder } from "@discordjs/builders";
import {
  ActionRowBuilder,
  AnySelectMenuInteraction,
  ButtonInteraction,
  CommandInteraction,
  Embed,
  Interaction,
  ModalSubmitInteraction,
} from "discord.js";

type SetResponseParams = {
  interaction:
    | AnySelectMenuInteraction
    | ButtonInteraction
    | CommandInteraction
    | ModalSubmitInteraction;
  defer?: {
    reply?: boolean;
    update?: boolean;
  };
  ephemeral?: boolean;
  replFunc: (...args: any[]) => {};
};

/**
 * Функция служит для обработки кнопки: "refresh"
 */
export async function SetResponseTo(params: SetResponseParams) {
  try {
    const { interaction, defer, replFunc, ephemeral } = params;
    const { reply, update } = defer;
    const res = await replFunc();
    if (defer) {
      if (reply) {
        await interaction.deferReply({ ephemeral: ephemeral });
      } else if (update) {
        await (interaction as any).deferUpdate({ ephemeral: !!ephemeral });
      }
      return interaction.editReply(res);
    }
    return interaction.reply(res);
  } catch {}
}
