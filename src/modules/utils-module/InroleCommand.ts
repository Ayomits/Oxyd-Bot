import BaseCommand from "@/abstractions/BaseCommand";
import { SnowflakeColors, SnowflakeType } from "@/enums";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  ComponentType,
  EmbedBuilder,
  GuildMember,
  SlashCommandBuilder,
  userMention,
} from "discord.js";
import _ from "lodash";

export class InRole extends BaseCommand {
  constructor() {
    super({
      builder: new SlashCommandBuilder()
        .setName(`inrole`)
        .setDescription(`Список участников имеющих определенную роль`)
        .addRoleOption((option) =>
          option
            .setName(`role`)
            .setDescription(`Укажите здесь нужную Вам роль`)
            .setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName(`page_size`)
            .setDescription(`Размер страницы`)
            .setMaxValue(50)
            .setMinValue(5)
            .setRequired(false)
        ),
      type: SnowflakeType.Everyone,
      isSlash: true,
    });
  }

  async execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const pageSize =
      (interaction.options.get("page_size")?.value as number) || 5;
    let pageNumber = 1;
    const role = interaction.options.get("role")?.role;
    const embed = new EmbedBuilder()
      .setTitle(`Просмотр участников роли - ${role.name}`)
      .setColor(SnowflakeColors.DEFAULT)
      .setFooter({
        text: interaction.user.globalName,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setThumbnail(interaction.user.displayAvatarURL());
    const allMembers = (await interaction.guild.members.fetch()).filter(
      (member) => member.roles.cache.has(role.id)
    );
    const disabledNextCondition = pageNumber * pageSize >= allMembers.size;
    const disabledPreviousCodition = pageNumber === 1;
    const firstRole = new ButtonBuilder()
      .setCustomId(
        `firstRole_${interaction.user.id}_${interaction.guild.id}_${interaction.id}`
      )
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(disabledNextCondition)
      .setEmoji("⏮");
    const lastRole = new ButtonBuilder()
      .setCustomId(
        `lastRole_${interaction.user.id}_${interaction.guild.id}_${interaction.id}`
      )
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(disabledPreviousCodition)
      .setEmoji("⏭");
    const next = new ButtonBuilder()
      .setCustomId(`next_role_${interaction.user.id}`)
      .setEmoji("▶")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(disabledNextCondition);
    const previous = new ButtonBuilder()
      .setCustomId(`previousRole_${interaction.user.id}`)
      .setEmoji("◀")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(disabledPreviousCodition);
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      firstRole,
      previous,
      next,
      lastRole
    );
    const repl = interaction.editReply({
      embeds: [
        embed.setDescription(
          this.setDescription(allMembers.clone().map((member) => member.id))
        ),
      ],
      components: [row],
    });
    const collector = (await repl).createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 600_000,
      filter: (i) => i.user.id === interaction.user.id,
    });

    collector.on("collect", async (inter) => {
      await inter.deferUpdate();
      if (inter.customId === "nuxtRole") {
        pageNumber += 1;
      } else if (inter.customId === "previousRole") {
        pageNumber = Math.max(pageNumber - 1, 1);
      } else if (inter.customId.includes("firstRole")) {
        pageNumber = 1;
      } else if (inter.customId.includes("lastRole")) {
        pageNumber = Math.ceil(allMembers.size / pageSize);
      }
      const arr = allMembers.clone().map((member) => member.id);
      const start = (pageNumber - 1) * pageSize;
      const end = start + pageSize;
      const description = this.setDescription(
        Array.from(arr).slice(start, end)
      );
      inter.editReply({
        embeds: [embed.setDescription(description)],
        components: [
          row.setComponents(
            firstRole.setDisabled(disabledPreviousCodition),
            previous.setDisabled(disabledPreviousCodition),
            next.setDisabled(disabledNextCondition),
            lastRole.setDisabled(disabledNextCondition)
          ),
        ],
      });
    });
  }

  private setDescription(members: string[]) {
    let description = "";
    members.map(
      (member, index) =>
        (description += `**${index + 1}.** ${userMention(member)}\n`)
    );
    return description;
  }
}
