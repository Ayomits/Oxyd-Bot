import { VerificationHelloModel } from "@/db/models/verification/VerificationHelloModel";
import { SnowflakeColors } from "@/enums";
import { SnowflakeMentionType } from "@/enums/SnowflakeMentionType";
import { buttonStyle } from "@/libs/embeds-functions/buttonStyle";
import { isEnabled } from "@/libs/embeds-functions/isEnabled";
import { mentionOrNot } from "@/libs/embeds-functions/mentions";
import {
  ActionRowBuilder,
  AnySelectMenuInteraction,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  ChannelType,
  CommandInteraction,
  EmbedBuilder,
  StringSelectMenuBuilder,
} from "discord.js";

export async function VerificationHelloResponse(
  interaction: CommandInteraction | ButtonInteraction | AnySelectMenuInteraction
) {
  const settings =
    (await VerificationHelloModel.findOne({ guildId: interaction.guild.id })) ||
    (await VerificationHelloModel.create({ guildId: interaction.guildId }));
  const embed = new EmbedBuilder()
    .setTitle(`Настройка приветственных сообщений`)
    .setColor(SnowflakeColors.DEFAULT)
    .addFields(
      {
        name: `> Состояние модуля`,
        value: `${isEnabled(settings.enable)}`,
        inline: true,
      },
      {
        name: `> Канал для приветствия`,
        value: `${mentionOrNot(
          settings.channelId,
          SnowflakeMentionType.CHANNEL
        )}`,
        inline: true,
      }
    );

  const selectMenu =
    new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
      new ChannelSelectMenuBuilder()
        .setChannelTypes(ChannelType.GuildText)
        .setCustomId(`helloverifcationchannelselect`)
    );
  const btns = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`helloverifcationsetmessage`)
      .setLabel(`Установить приветственное сообщение`)
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(`helloverifcationtoggler`)
      .setLabel(`Включить/Выключить`)
      .setStyle(buttonStyle(settings.enable))
  );
  const backButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`helloverifcationrefresher`)
      .setLabel(`Обновить`)
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(`helloverifcationbackbutton`)
      .setLabel(`Назад`)
      .setStyle(ButtonStyle.Danger)
  );
  return {
    embeds: [embed],
    components: [selectMenu, btns, backButton],
  };
}
