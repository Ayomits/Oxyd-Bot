import {
  AnySelectMenuInteraction,
  ButtonInteraction,
  CommandInteraction,
  ModalSubmitInteraction,
} from "discord.js";
import Logger from "../core-functions/Logger";

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
  const { interaction, defer, replFunc, ephemeral } = params;
  const { reply, update } = defer;
  const res = await replFunc(interaction);
  if (defer) {
    if (reply) {
      await interaction.deferReply({ ephemeral: ephemeral });
    } else if (update) {
      await (interaction as any).deferUpdate({ ephemeral: !!ephemeral });
    }
    Logger.log(`Response was edited for ${interaction.id}`);
    return await interaction.editReply(res);
  }
  Logger.log(`Response was replied for ${interaction.id}`);
  return await interaction.reply(res);
}
