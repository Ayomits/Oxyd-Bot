import { SnowflakeMentionType } from "@/enums/SnowflakeMentionType";
import { VerificationModuleModel } from "@/models/VerificationModel";
import { isEnabled } from "@/utils/functions/isEnabled";
import { mentionOrNot } from "@/utils/functions/mentions";
import { snowflakeArraysFilter } from "@/utils/functions/snowflakeArraysFilter";
import {
  ButtonInteraction,
  CommandInteraction,
  EmbedBuilder,
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
      },
      {
        name: `> Роли верификации`,
        value: `${snowflakeArraysFilter(
          verificationSettings.roles,
          interaction.guild,
          "roles",
          SnowflakeMentionType.ROLE
        )}`,
        inline: false,
      }
    );
    
    return {embeds: [embed], components: []}
}
