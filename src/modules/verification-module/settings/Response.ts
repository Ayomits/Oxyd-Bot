import { SnowflakeColors } from "@/enums";
import { SnowflakeMentionType } from "@/enums/SnowflakeMentionType";
import { VerificationModuleModel } from "@/models/VerificationModel";
import { buttonStyle } from "@/utils/functions/buttonStyle";
import { isEnabled } from "@/utils/functions/isEnabled";
import { mentionOrNot } from "@/utils/functions/mentions";
import { snowflakeArraysFilter } from "@/utils/functions/snowflakeArraysFilter";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  StringSelectMenuBuilder,
} from "discord.js";

export async function VerificationResponse(
  interaction: ButtonInteraction | CommandInteraction
) {
  const verificationSettings =
    (await VerificationModuleModel.findOne({
      guildId: interaction.guild.id,
    })) ||
    (await VerificationModuleModel.create({ guildId: interaction.guild.id }));
  const embed = new EmbedBuilder()
    .setTitle(`Настройка модуля верификации`)
    .setFooter({
      text: interaction.user.globalName,
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setColor(SnowflakeColors.DEFAULT)
    .setThumbnail(interaction.user.displayAvatarURL())
    .setFields(
      {
        name: `> Состояние модуля`,
        value: `\`\`\`${isEnabled(verificationSettings.enable)}\`\`\``,
        inline: true,
      },
      {
        name: "> Выдача роли неверифицированного участника при заходе",
        value: `\`\`\`${isEnabled(verificationSettings.giveUnverify)}\`\`\``,
        inline: false,
      },
      {
        name: `> Канал верификации`,
        value: `${mentionOrNot(
          verificationSettings.channel,
          SnowflakeMentionType.CHANNEL
        )}`,
        inline: true,
      },
      {
        name: `> Канал для логов верификации`,
        value: `${mentionOrNot(
          verificationSettings.logChannel,
          SnowflakeMentionType.CHANNEL
        )}`,
        inline: true,
      },
      {
        name: `> Роль неверифицированного участника`,
        value: `${mentionOrNot(
          verificationSettings.unverifyRole,
          SnowflakeMentionType.ROLE
        )}`,
        inline: true,
      },
      
    );
  const selectMenu =
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`verificationSettingsSelect_${interaction.user.id}`)
        .setPlaceholder(`Выберите настройку`)
        .addOptions(
          {
            label: `Канал для верификации`,
            value: `setter_channel`,
            emoji: "✅",
            description: `Место куда будет опубликован эмбед и кнопки`,
          },
          {
            label: `Канал для логгирования`,
            value: "setter_logChannel",
            emoji: "✡",
            description: `Место куда будут логироваться верификации участников`,
          },
          {
            label: `Роль неверифицированного участника`,
            value: `setter_unverifyRole`,
            emoji: "🎭",
            description: `Роль, которую нужно забирать при верификации и выдавать при заходе на сервер`,
          },
          {
            label: `Управление ролями верификации`,
            value: `roles`,
            emoji: "💫",
            description: `Эта опция позволит управлять отображением ролей верификации`,
          },
          {
            label: `Управление эмбедом верификации`,
            value: `embed`,
            emoji: "🎨",
            description: `Подготовьте вебхук в дискохуке и просто скиньте, бот сделает всё сам`,
          }
        )
    );
  const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("toggleVerificationModule_enable")
      .setLabel("Включить/Выключить")
      .setStyle(buttonStyle(verificationSettings.enable)),
    new ButtonBuilder()
      .setCustomId("toggleVerificationModule_giveUnverify")
      .setLabel("Выдача роли unverify при заходе")
      .setStyle(buttonStyle(verificationSettings.giveUnverify)),
    new ButtonBuilder()
      .setLabel(`Опубликовать`)
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("publishVerificationSettings"),
    new ButtonBuilder()
      .setCustomId("refreshVerificationSettings")
      .setLabel("Обновить")
      .setStyle(ButtonStyle.Primary)
  );
  return { embeds: [embed], components: [selectMenu, buttonRow] };
}
