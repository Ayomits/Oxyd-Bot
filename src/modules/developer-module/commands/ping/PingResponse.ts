import { SnowflakeColors } from "@/enums";
import { positiveNumber } from "@/utils/functions/positiveNumber";
import Logger from "@/utils/system/Logger";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";

export function pingResponse(
  interaction: CommandInteraction | ButtonInteraction
) {
  const wsPing = interaction.client.ws.ping;
  const msgPing = Math.floor(
    new Date().getTime() - interaction.createdTimestamp
  );
  const refreshButton = new ButtonBuilder()
    .setLabel(`Обновить`)
    .setStyle(ButtonStyle.Success)
    .setCustomId(`pingRefresh_${interaction.user.id}`);
  const embed = new EmbedBuilder()
    .setColor(SnowflakeColors.DEFAULT)
    .setTitle(`Проверка задержки бота`)
    .setFields(
      {
        name: `Задержка вебсокета`,
        value: `\`\`\`${positiveNumber(wsPing)} ms\`\`\``,
        inline: true,
      },
      {
        name: `Задержка сообщений`,
        value: `\`\`\`${positiveNumber(msgPing)} ms\`\`\``,
        inline: true,
      }
    );
  Logger.log(`Ws: ${positiveNumber(wsPing)} ms, Msg: ${positiveNumber(msgPing)} ms`);
  return {
    embeds: [embed],
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(refreshButton),
    ],
  };

}
