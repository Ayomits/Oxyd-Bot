import { SnowflakeColors } from "@/enums";
import {
  VerificationModuleDocument,
  VerificationModuleModel,
} from "@/db/models/verification/VerificationModel";
import {
  ButtonInteraction,
  EmbedBuilder,
  Guild,
  GuildMember,
  roleMention,
  Snowflake,
  StringSelectMenuInteraction,
  TextChannel,
  userMention,
} from "discord.js";
import { VerificationRoleModel } from "@/db/models/verification/VerificationRoleModel";
import { VerificationHelloModel } from "@/db/models/verification/VerificationHelloModel";

let cacheArr = [];
let timeout: NodeJS.Timeout | null;

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
  const verificationRoles = (
    await VerificationRoleModel.find({ guildId: interaction.guild.id })
  )
    .filter((role) => interaction.guild.roles.cache.get(role.roleId))
    .map((role) => role.roleId);
  const unverifyRole = guild.roles.cache.get(
    verificationSettings!.unverifyRole
  );
  if (member.roles.cache.some((role) => verificationRoles.includes(role.id)))
    return interaction.editReply({ content: `Вы **уже** верифицированы` });

  cacheArr.push(interaction.user.id);

  if (timeout) clearTimeout(timeout);

  timeout = setTimeout(() => {
    verificationGreatings(interaction)
  }, 5000);

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

export async function verificationGreatings(
  interaction: ButtonInteraction | StringSelectMenuInteraction
) {
  const existed = await VerificationHelloModel.findOne({
    guildId: interaction.guild.id,
  });
  const channel = interaction.guild.channels.cache.get(
    existed.channelId
  ) as TextChannel;
  if (!channel) return;
  if (existed.message.messages.length <= 0) return;
  for (const message of existed.message.messages) {
    channel.send({
      ...message.data,
      content: `${cacheArr.map((userId) => userMention(userId)).join(" ")}`,
    });
  }
  cacheArr = [];
}
