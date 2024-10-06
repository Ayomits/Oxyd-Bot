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
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";

export async function TeleportsResponse(
  interaction: ButtonInteraction,
  pageNumber = 1,
  pageSize = 5
) {
  const options = [];
  const allTelepors = await TeleportModel.find({
    guildId: interaction.guild.id,
  })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize + 1);
  const embed = new EmbedBuilder()
    .setTitle(`Телепорты`)
    .setColor(SnowflakeColors.DEFAULT)
    .setTimestamp(new Date())
    .setThumbnail(interaction.user.displayAvatarURL());
  let description = "";
  let start = (pageNumber - 1) * pageSize;
  const end = pageNumber * pageSize;
  if (allTelepors.length <= 0) {
    description = "Телепортов нет";
  } else {
    let index = 1;
    for (const teleport of allTelepors.slice(start, end)) {
      description += `${bold(index.toString())}) ${
        teleport.displayName
      }\n${channelMention(teleport.channelId)}`;
      options.push(
        new StringSelectMenuOptionBuilder()
          .setLabel(`${teleport.displayName}`)
          .setValue(`${teleport._id}`)
      );
      index += 1;
    }
  }
  embed.setDescription(description);
  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`teleportprevious`)
      .setDisabled(pageNumber === 1)
      .setEmoji("◀")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(`teleportcreate`)
      .setLabel("Создать")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(`teleportnext`)
      .setEmoji("▶")
      .setDisabled(pageNumber * pageSize >= allTelepors.length)
      .setStyle(ButtonStyle.Secondary)
  );
  const backButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`teleportbackbutton`)
      .setLabel("Назад")
      .setStyle(ButtonStyle.Danger)
  );
  const selectMenu =
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`teleportselectmenu`)
        .setPlaceholder(`Выберите нужный телепорт`)
        .setOptions(options)
    );
  const components = [backButton, buttons] as any[];
  if (options.length >= 1) components.push(selectMenu);
  return { embeds: [embed], components: components.reverse() };
}
