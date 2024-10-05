import { SnowflakeColors } from "@/enums";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  ChannelType,
  EmbedBuilder,
  StringSelectMenuInteraction,
} from "discord.js";

export function LogChannelSetupResponse(
  interaction: StringSelectMenuInteraction
) {
  const value = interaction.values;
  const embed = new EmbedBuilder()
    .setTitle(`Настройка канала логгирования`)
    .setDescription(`При помощи меню ниже укажите нужный канал`)
    .setColor(SnowflakeColors.DEFAULT)
    .setThumbnail(interaction.user.displayAvatarURL())
    .setTimestamp(new Date());
  const selectMenu =
    new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
      new ChannelSelectMenuBuilder()
        .setCustomId(
          `settingsChannelSelect_${value.map((val) => val).join("_")}`
        )
        .setChannelTypes(ChannelType.GuildText)
        .setPlaceholder(`Выберите нужный канал`)
    );
  const backButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`logsettingschannelbackbutton`)
      .setLabel(`Назад`)
      .setStyle(ButtonStyle.Danger)
    // new ButtonBuilder()
    //   .setCustomId(`logsettingschannelrefherbutton`)
    //   .setLabel(`Обновить`)
    //   .setStyle(ButtonStyle.Primary)
  );
  return {
    embeds: [embed],
    components: [selectMenu, backButton],
  };
}
