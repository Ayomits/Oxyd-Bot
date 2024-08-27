import { SnowflakeColors } from "@/enums";
import {
  VerificationModuleDocument,
  VerificationModuleModel,
} from "@/models/VerificationModel";
import {
  ButtonInteraction,
  EmbedBuilder,
  Guild,
  GuildMember,
  roleMention,
  Snowflake,
  StringSelectMenuInteraction,
  TextChannel,
} from "discord.js";

export async function verifyUser(
  interaction: ButtonInteraction | StringSelectMenuInteraction,
  args: string[]
) {
  await interaction.deferReply({ ephemeral: true });
  const roleId =
    interaction instanceof StringSelectMenuInteraction
      ? interaction.values[0]
      : args[0];
  const member = interaction.member as GuildMember;
  const guild = interaction.guild as Guild;
  const verificationSettings = await VerificationModuleModel.findOne({
    guildId: guild.id,
  });
  const unverifyRole = guild.roles.cache.get(
    verificationSettings!.unverifyRole
  );
  await Promise.all([
    interaction.editReply({
      content: `Поздравляю! Вы взяли роль ${roleMention(roleId)}`,
    }),
    member.roles.add(roleId),
    member.roles.remove(unverifyRole),
    verificationLog(verificationSettings, roleId, interaction),
  ]);
}

export async function verificationLog(
  verificationSettings: VerificationModuleDocument,
  roleId: Snowflake,
  interaction: ButtonInteraction | StringSelectMenuInteraction
) {
  const logChannel = interaction.guild.channels.cache.get(
    verificationSettings.logChannel
  ) as TextChannel;
  if (!logChannel) return;
  const embed = new EmbedBuilder()
    .setTitle(`Пользователь прошёл верификацию`)
    .setDescription(
      `Пользователь ${interaction.user} выбрал роль ${roleMention(roleId)}`
    )
    .setColor(SnowflakeColors.DEFAULT)
    .setThumbnail(interaction.user.displayAvatarURL())
    .setFooter({
      text: interaction.user.globalName,
      iconURL: interaction.user.displayAvatarURL(),
    });
  return logChannel.send({ embeds: [embed] });
}
