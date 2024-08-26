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
  const verificationSettings = await VerificationModuleModel.findOne({
    guildId: interaction.guild.id,
  });
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
        value: `**${isEnabled(verificationSettings.enable)}**`,
        inline: true,
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
        name: `> Роль неверифицированного участника`,
        value: `${mentionOrNot(
          verificationSettings.unverifyRole,
          SnowflakeMentionType.ROLE
        )}`,
        inline: true,
      }
    );
  const selectMenu =
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`verificationSettings_${interaction.user.id}`)
        .setPlaceholder(`Выберите настройку`)
        .addOptions(
          {
            label: `Канал для верификации`,
            value: `channel`,
            emoji: "✅",
            description: `Место куда будет опубликован эмбед и кнопки`,
          },
          {
            label: `Роль неверифицированного участника`,
            value: `unverifyRole`,
            emoji: "🎭",
            description: `Если поставить, тогда при заходе на сервер будет выдана эта роль`,
          },
          {
            label: `Управление ролями верификации`,
            value: `verificationRoleManage`,
            emoji: "💫",
            description: `Эта опция позволит управлять отображением ролей верификации`,
          },
          {
            label: `Управление эмбедом верификации`,
            value: `verificationEmbedManage`,
            emoji: "🎨",
            description: `Подготовьте вебхук в дискохуке и просто скиньте, бот сделает всё сам`,
          }
        )
    );
  const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("toggleVerificationModule")
      .setLabel("Включить/Выключить")
      .setStyle(buttonStyle(verificationSettings.enable)),
    new ButtonBuilder()
      .setCustomId("refreshVerificationSettings")
      .setLabel("Обновить")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("publishVerificationSettings")
  );
  return { embeds: [embed], components: [selectMenu, buttonRow] };
}
