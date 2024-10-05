import { SnowflakeColors } from "@/enums";
import { SnowflakeMentionType } from "@/enums/SnowflakeMentionType";
import { BumpReminderModuleModel } from "@/db/models/bump-reminder/BumpReminderModel";
import { buttonStyle } from "@/libs/embeds-functions/buttonStyle";
import { isEnabled } from "@/libs/embeds-functions/isEnabled";
import { mentionOrNot } from "@/libs/embeds-functions/mentions";
import { snowflakeArraysFilter } from "@/libs/embeds-functions/snowflakeArraysFilter";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  ChannelType,
  CommandInteraction,
  EmbedBuilder,
  RoleSelectMenuBuilder,
} from "discord.js";

export async function BumpReminderResponse(
  interaction: ButtonInteraction | CommandInteraction
) {
  const bumpSettings =
    (await BumpReminderModuleModel.findOne({
      guildId: interaction.guild.id,
    })) ||
    (await BumpReminderModuleModel.create({
      guildId: interaction.guild.id,
    }));
  const embed = new EmbedBuilder()
    .setTitle(`Настройка модуля напоминаний о бампах`)
    .setColor(SnowflakeColors.DEFAULT)
    .setFooter({
      text: interaction.user.globalName,
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setTimestamp(new Date())
    .setThumbnail(interaction.user.displayAvatarURL())
    .setFields(
      {
        name: `> Состояние модуля`,
        value: `\`\`\`${isEnabled(bumpSettings.enable)}\`\`\``,
        inline: true,
      },
      {
        name: `> Пингуемые роли`,
        value: `${snowflakeArraysFilter(
          bumpSettings.pingRoleIds,
          interaction.guild,
          "roles",
          SnowflakeMentionType.ROLE
        )}`,
        inline: true,
      },
      {
        name: `> Канал для пингов`,
        value: `${mentionOrNot(
          bumpSettings.pingChannelId,
          SnowflakeMentionType.CHANNEL
        )}`,
        inline: true,
      }
    );
  const pingRoles = new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
    new RoleSelectMenuBuilder()
      .addDefaultRoles(
        bumpSettings.pingRoleIds.filter((role) =>
          interaction.guild.roles.cache.get(role)
        )
      )
      .setMinValues(1)
      .setMaxValues(25)
      .setCustomId(`bumpreminderroles_${interaction.user.id}`)
      .setPlaceholder(`Выберите пингуемые роли`)
  );
  const pingChannel =
    new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
      new ChannelSelectMenuBuilder()
        .setChannelTypes(ChannelType.GuildText)
        .setCustomId("bumpreminderchannel")
        .setPlaceholder(`Выберите канал для пингов`)
    );
  const toggleModule = new ButtonBuilder()
    .setCustomId(`bumpremindertoggler`)
    .setLabel(`Включить/Выключить`)
    .setStyle(buttonStyle(bumpSettings.enable));
  const refreshButton = new ButtonBuilder()
    .setCustomId("bumprefreshbutton")
    .setLabel(`Обновить`)
    .setStyle(ButtonStyle.Primary);
  const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    toggleModule,
    refreshButton
  );
  return {
    embeds: [embed],
    components: [pingRoles, pingChannel, buttonRow],
  };
}
