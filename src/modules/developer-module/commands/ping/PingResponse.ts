import { SnowflakeColors } from "@/enums";
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
        value: `\`\`\`${interaction.client.ws.ping}\`\`\``,
        inline: true,
      },
      {
        name: `Задержка сообщений`,
        value: `\`\`\`${Math.floor(
          new Date().getTime() - interaction.createdTimestamp
        )}\`\`\``,
        inline: true,
      }
    );
  return {
    embeds: [embed],
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(refreshButton),
    ],
  };
}
