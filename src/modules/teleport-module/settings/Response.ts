import { TeleportModel } from "@/db/models/teleport/TeleportModel";
import { TeleportSettingsModel } from "@/db/models/teleport/TeleportSettingsModel";
import { SnowflakeColors } from "@/enums";
import { buttonStyle } from "@/libs/embeds-functions/buttonStyle";
import { isEnabled } from "@/libs/embeds-functions/isEnabled";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";

export async function TeleportSettingsResponse(
  interaction: CommandInteraction | ButtonInteraction
) {
  const existed =
    (await TeleportSettingsModel.findOne({
      guildId: interaction.guild.id,
    })) ||
    (await TeleportSettingsModel.create({ guildId: interaction.guild.id }));
  const allTeleports = await TeleportModel.countDocuments({
    guildId: interaction.guild.id,
  });
  const embed = new EmbedBuilder()
    .setTitle(`Настройка модуля телепортов`)
    .setColor(SnowflakeColors.DEFAULT)
    .setFields(
      {
        name: `> Состояние модуля`,
        value: `${isEnabled(existed.enable)}`,
      },
      {
        name: `> Количество телепортов на сервере`,
        value: `${allTeleports}`,
      }
    )
    .setThumbnail(interaction.user.displayAvatarURL())
    .setTimestamp(new Date());

  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`teleportsettingstoggler`)
      .setStyle(buttonStyle(existed.enable))
      .setLabel(`Включить/Выключить`),
    new ButtonBuilder()
      .setCustomId(`teleportsettingsgoto`)
      .setLabel(`Перейти к телепортам`)
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(`teleportsettingsrefresher`)
      .setLabel(`Обновить`)
      .setStyle(ButtonStyle.Primary)
  );
  return {
    embeds: [embed],
    components: [buttons]
  }
}
