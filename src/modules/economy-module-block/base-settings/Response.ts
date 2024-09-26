import { EconomySettingsModel } from "@/db/models/economy/EconomySettingsModel";
import { SnowflakeColors } from "@/enums";
import { SnowflakeMentionType } from "@/enums/SnowflakeMentionType";
import { buttonStyle } from "@/utils/functions/buttonStyle";
import { isEnabled } from "@/utils/functions/isEnabled";
import { snowflakeArraysFilter } from "@/utils/functions/snowflakeArraysFilter";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  ChannelType,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";

export async function EconomySettingsResponse(
  interaction: CommandInteraction | ButtonInteraction
) {
  const existed =
    (await EconomySettingsModel.findOne({ guildId: interaction.guild.id })) ||
    (await EconomySettingsModel.create({ guildId: interaction.guild.id }));
  const embed = new EmbedBuilder()
    .setTitle(`Настройки модуля экономики`)
    .setColor(SnowflakeColors.DEFAULT)
    .setTimestamp(new Date())
    .setThumbnail(interaction.user.displayAvatarURL())
    .setFields(
      {
        name: `> Состояние модуля`,
        value: `${isEnabled(existed.enable)}`,
        inline: true,
      },
      {
        name: `> Количество валюты за 1 сообщение`,
        value: `${existed.messageRates}`,
        inline: true,
      },
      {
        name: `> Количество валюты за минуту в голосовом канале`,
        value: `${existed.voiceRates}`,
        inline: true,
      },
      {
        name: `> Категории получения валюты`,
        value: `${snowflakeArraysFilter(
          existed.categories,
          interaction.guild,
          "channels",
          SnowflakeMentionType.CHANNEL
        )}`,

        inline: false,
      },
      {
        name: `> Игнорируемые каналы получения валюты`,
        value: `${snowflakeArraysFilter(
          existed.ignoredChannels,
          interaction.guild,
          "channels",
          SnowflakeMentionType.CHANNEL
        )}`,
        inline: false,
      },
    );
  const buttonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`economysetter_messageRates`)
      .setLabel(`Валюта за сообщение`)
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(`economysetter_voiceRates`)
      .setLabel(`Валюта за войс`)
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(`economytoggler`)
      .setLabel(`Включить/Выключить`)
      .setStyle(buttonStyle(existed.enable)),
    new ButtonBuilder()
      .setCustomId(`economyrefresher`)
      .setLabel(`Обновить`)
      .setStyle(ButtonStyle.Primary)
  );
  const selectMenus = [
    new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
      new ChannelSelectMenuBuilder()
        .setChannelTypes(ChannelType.GuildCategory)
        .setPlaceholder(`Выберите нужные категории`)
        .setCustomId(`economysetterselectmenu_categories`)
        .setMinValues(0)
        .setMaxValues(25)
        .setDefaultChannels(
          existed.categories.length >= 1
            ? existed.categories.filter((category) =>
                interaction.guild.channels.cache.get(category)
              )
            : []
        )
    ),
    new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
      new ChannelSelectMenuBuilder()
        .setChannelTypes(ChannelType.GuildText)
        .setMinValues(0)
        .setMaxValues(25)
        .setPlaceholder(`Выберите игнорируемые каналы`)
        .setCustomId(`economysetterselectmenu_ignoredChannels`)
        .setDefaultChannels(
          existed.categories.length >= 1
            ? existed.ignoredChannels.filter((channel) =>
                interaction.guild.channels.cache.get(channel)
              )
            : []
        )
    ),
  ];
  return {
    embeds: [embed],
    components: [...selectMenus, buttonsRow],
  };
}
