import BaseComponent from "@/abstractions/BaseComponent";
import { SomethingWentWrong } from "@/errors/SomethingWentWrong";
import { VerificationModuleModel } from "@/models/VerificationModel";
import { VerificationRoleModel } from "@/models/VerificationRoleModel";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ComponentType,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  TextChannel,
} from "discord.js";

function resPrepare(messages: any, row: any) {
  for (let i = 0; i < messages.length; i++) {
    const data = messages[i].data;
    const res = { embeds: [...data.embeds] } as any;
    if (messages.length + 1 >= i) {
      res.components = [row];
    }
    return res;
  }
}

export class VerificationRolesPublish extends BaseComponent {
  constructor() {
    super("publishVerificationSettings", 600);
  }

  async execute(interaction: ButtonInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const [verificationSettings, verificationRoles] = await Promise.all([
      VerificationModuleModel.findOne({ guildId: interaction.guild.id }),
      VerificationRoleModel.find({ guildId: interaction.guild.id }),
    ]);

    if (!verificationSettings.enable)
      return interaction.editReply({ content: `Модуль **не** включен` });
    const channel = interaction.guild.channels.cache.get(
      verificationSettings.channel
    ) as TextChannel;
    if (!channel)
      return interaction.editReply({
        content: `Не указан канал для публикации`,
      });
    if (!verificationRoles)
      return interaction.editReply({
        content: `Не создано ни 1 роли для верификации`,
      });
    if (verificationRoles.length < 1)
      return interaction.editReply({
        content: `Не создано ни 1 роли для верификации`,
      });
    const validVerificationRoles = verificationRoles.filter((role) =>
      interaction.guild.roles.cache.get(role.roleId)
    );
    if (validVerificationRoles.length < 1)
      return interaction.editReply({
        content: `Ваши роли верификации устарели. Создайте/обновить айди существующих`,
      });
    if (verificationSettings.messages.length < 1)
      return interaction.editReply({
        content: `У Вас **нет** эмбеда верификации. Создайте и установите его с помощью https://discohook.org`,
      });

    let row;
    if (validVerificationRoles.length > 5) {
      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(`validverificationselect`)
        .setPlaceholder(`Выберите нужную роль`);
      for (const role of validVerificationRoles) {
        selectMenu.addOptions(
          new StringSelectMenuOptionBuilder()
            .setValue(`${role.roleId}`)
            .setLabel(`${role.displayName}`)
        );
      }
      row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        selectMenu
      );
    } else {
      const buttons = [];
      for (const role of validVerificationRoles) {
        buttons.push(
          new ButtonBuilder()
            .setCustomId(`validvericiationbutton_${role.roleId}`)
            .setLabel(role.displayName)
            .setStyle(role.style)
        );
      }
      row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);
    }
    const preview = resPrepare(verificationSettings.messages, row);
    const offerRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`offerAccept_${interaction.user.id}`)
        .setLabel(`Опубликовать`)
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`offerDecline_${interaction.user.id}`)
        .setLabel(`Отменить`)
        .setStyle(ButtonStyle.Danger)
    );
    const repl = await interaction.editReply({
      ...preview,
      components: [row, offerRow],
    });
    repl
      .createMessageComponentCollector({
        time: 600_000,
        filter: (i) => i.user.id === interaction.user.id,
        componentType: ComponentType.Button,
      })
      .once("collect", async (inter) => {
        if (inter.customId.includes("Accept")) {
          try {
            await inter.deferUpdate();
            await channel.send(preview);
            return inter.editReply({
              content: `Публикация прошла **успешно**`,
              embeds: [],
              components: [],
            });
          } catch {
            return new SomethingWentWrong(inter);
          }
        } else {
          await inter.deferUpdate();
          inter.editReply({
            content: `Отмена публикации`,
            embeds: [],
            components: [],
          });
        }
      });
  }
}
