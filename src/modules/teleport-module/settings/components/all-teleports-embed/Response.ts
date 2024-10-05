import { TeleportModel } from "@/db/models/teleport/TeleportModel";
import { SnowflakeColors } from "@/enums";
import {
  ActionRowBuilder,
  bold,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  channelMention,
  EmbedBuilder,
} from "discord.js";

export async function TeleportsResponse(
  interaction: ButtonInteraction,
  pageNumber = 1,
  pageSize = 5
) {
  const allTelepors = await TeleportModel.find({
    guildId: interaction.guild.id,
  });
  const embed = new EmbedBuilder()
    .setTitle(`Телепорты`)
    .setColor(SnowflakeColors.DEFAULT)
    .setTimestamp(new Date())
    .setThumbnail(interaction.user.displayAvatarURL());
  let description = "";
  if (allTelepors.length <= 0) {
    description = "Телепортов нет";
  } else {
    let index = 1;
    for (const teleport of allTelepors) {
      description += `${bold(index.toString())}) ${
        teleport.displayName
      }\n${channelMention(teleport.channelId)}`;
      index += 1;
    }
  }
  embed.setDescription(description);
  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`teleportprevious`)
      .setEmoji("◀")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(`teleportnext`)
      .setEmoji("▶")
      .setStyle(ButtonStyle.Secondary)
  );
  const backButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`teleportbackbutton`)
      .setLabel("Назад")
      .setStyle(ButtonStyle.Danger)
  );
  return { embeds: [embed], components: [buttons, backButton] };
}
