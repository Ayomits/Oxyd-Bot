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
  ModalBuilder,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  TextInputBuilder,
  TextInputStyle,
  userMention,
} from "discord.js";
import _ from "lodash";

export class InRole extends BaseCommand {
  constructor() {
    super({
      builder: new SlashCommandBuilder()
        .setName(`inrole`)
        .setDescription(`Список участников, имеющих определенную роль`)
        .addRoleOption((option) =>
          option
            .setName(`role`)
            .setDescription(`Укажите нужную роль`)
            .setRequired(true)
        )
        .setDMPermission(false)
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
      .setThumbnail(interaction.user.displayAvatarURL());

    const allMembers = (await interaction.guild.members.fetch()).filter(
      (member) => member.roles.cache.has(role.id)
    );
    const lastPage = Math.ceil(allMembers.size / pageSize);
    const updateButtons = () => {
      const totalPages = Math.ceil(allMembers.size / pageSize);
      const disabledNextCondition = pageNumber >= totalPages;
      const disabledPreviousCondition = pageNumber <= 1;

      firstRole.setDisabled(pageNumber === 1);
      lastRole.setDisabled(lastPage === 1 || lastPage === 0);
      next.setDisabled(disabledNextCondition);
      previous.setDisabled(disabledPreviousCondition);
    };

    const firstRole = new ButtonBuilder()
      .setCustomId(
        `firstRole_${interaction.user.id}_${interaction.guild.id}_${interaction.id}`
      )
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("⏮");

    const lastRole = new ButtonBuilder()
      .setCustomId(
        `lastRole_${interaction.user.id}_${interaction.guild.id}_${interaction.id}`
      )
      .setDisabled(lastPage === 1 || lastPage === 0)
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("⏭");

    const next = new ButtonBuilder()
      .setCustomId(`next_role_${interaction.user.id}`)
      .setEmoji("▶")
      .setStyle(ButtonStyle.Secondary);

    const previous = new ButtonBuilder()
      .setCustomId(`previousRole_${interaction.user.id}`)
      .setEmoji("◀")
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      firstRole,
      previous,
      next,
      lastRole
    );

    const updateEmbed = () => {
      const arr = Array.from(allMembers.keys());
      const start = (pageNumber - 1) * pageSize;
      const end = start + pageSize;
      const description = this.setDescription(arr.slice(start, end), start);
      embed.setDescription(description);
      embed.setFooter({
        text: `Страница: ${lastPage === 0 ? 0 : pageNumber}/${lastPage}`,
      });
    };

    updateEmbed();
    updateButtons();

    const repl = await interaction.editReply({
      embeds: [embed],
      components: [row],
    });

    const collector = repl.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 600_000,
      filter: (i) => i.user.id === interaction.user.id,
    });

    collector.on("collect", async (inter) => {
      await inter.deferUpdate();

      if (inter.customId.includes("next_role")) {
        pageNumber++;
      } else if (inter.customId.includes("previousRole")) {
        pageNumber = Math.max(pageNumber - 1, 1);
      } else if (inter.customId.includes("firstRole")) {
        pageNumber = 1;
      } else if (inter.customId.includes("lastRole")) {
        pageNumber = lastPage;
      }

      updateEmbed();
      updateButtons();

      await inter.editReply({
        embeds: [embed],
        components: [row],
      });
    });
  }

  private setDescription(members: string[], start: number) {
    if (members.length <= 0) return `Нет пользователей с указанной ролью`;
    let start_ = start;
    return members
      .map((member) => {
        start_ += 1;
        return `**${start_}.** ${userMention(member)}`;
      })
      .join("\n");
  }
}
