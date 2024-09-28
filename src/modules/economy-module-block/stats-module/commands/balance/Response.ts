import { SnowflakeColors } from "@/enums";
import { EconomyUserActions } from "@/utils/economy/user";
import {
  ActionRowBuilder,
  bold,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  GuildMember,
  UserSelectMenuBuilder,
} from "discord.js";

export async function EconomyBalanceCommandResponse(
  interaction: CommandInteraction | ButtonInteraction,
  args?: string[]
) {
  const user =
    interaction instanceof CommandInteraction
      ? interaction.options.get("user")?.user || interaction.user
      : interaction.guild.members.cache.get(args[0])!.user;
  const dbUser = new EconomyUserActions(interaction.guildId, user.id);
  const fetched = await dbUser.fetch();
  if (!fetched)
    return {
      content: `Указанный Вами пользователь **не** существует`,
    };
  const embed = new EmbedBuilder()
    .setColor(SnowflakeColors.DEFAULT)
    .setTitle(`Баланс пользователя ${user.globalName}`)
    .setThumbnail(user.displayAvatarURL())
    .setTimestamp(new Date())
    .setFooter({
      text: user.globalName,
      iconURL: user.displayAvatarURL(),
    })
    .setDescription(
      `${bold("Наличные:")} ${fetched.balance}\n${bold("В банке:")} ${
        fetched.bankBalance
      }\n${bold("В общей сумме:")} ${fetched.balance + fetched.bankBalance}`
    );
  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`economybalancetransfer_${user.id}`)
      .setLabel(`Перевести`)
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(`economybalancebank_deposit`)
      .setLabel(`Положить в банк`)
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(`economybalancebank_withdraw`)
      .setLabel(`Снять из банка`)
      .setStyle(ButtonStyle.Secondary)
  );
  const refreshRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`economybalancerefresher_${user.id}`)
      .setLabel(`Обновить`)
      .setStyle(ButtonStyle.Primary)
  );
  const components = [];
  !user || user.id !== interaction.user.id ? null : components.push(buttons);
  components.push(refreshRow);
  return {
    embeds: [embed],
    components: [...components],
  };
}

export async function EconomyBalanceCommandTransferButtonResponse(
  interaction: ButtonInteraction
) {
  const embed = new EmbedBuilder()
    .setTitle(`Перевод средств`)
    .setColor(SnowflakeColors.DEFAULT)
    .setDescription(`Выберите пользователя ниже`)
    .setThumbnail(interaction.user.displayAvatarURL())
    .setTimestamp(new Date())
    .setFooter({
      text: interaction.user.globalName,
      iconURL: interaction.user.displayAvatarURL(),
    });
  const selectMenu =
    new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
      new UserSelectMenuBuilder()
        .setCustomId(`economybalanceuserselectmenu`)
        .setPlaceholder(`Выберите нужного пользователя`)
    );
  const backButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`economybalancebackbutton_${interaction.user.id}`)
      .setLabel(`Назад`)
      .setStyle(ButtonStyle.Danger)
  );
  return {
    embeds: [embed],
    components: [selectMenu, backButton],
  };
}
