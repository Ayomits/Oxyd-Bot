import BaseCommand from "@/abstractions/BaseCommand";
import { SnowflakeColors, SnowflakeType } from "@/enums";
import {
  bold,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import {
  findReactionByKeyOrAliases,
  Reaction,
  ReactionConfig,
} from "../ReactionTypes";
import reactions from "../configs/react.json";

export class ReactionHelpCommand extends BaseCommand {
  constructor() {
    super({
      type: SnowflakeType.Everyone,
      isSlash: true,
      builder: new SlashCommandBuilder()
        .setName(`reaction-help`)
        .setDescription(`Документация по реакциям`)
        .addStringOption((option) =>
          option
            .setName(`name`)
            .setDescription(`Название реакции`)
            .setRequired(false)
        ),
    });
  }

  public async execute(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const reactionName = interaction.options.get("name")?.value as string;
    const embed = new EmbedBuilder()
      .setTitle(`Документация реакций`)
      .setColor(SnowflakeColors.DEFAULT)
      .setThumbnail(interaction.user.displayAvatarURL())
      .setFooter({
        text: interaction.user.globalName,
        iconURL: interaction.user.displayAvatarURL(),
      });

    if (reactionName) {
      const reaction = findReactionByKeyOrAliases(
        reactionName.toLowerCase(),
        reactions as unknown as Reaction
      ) as ReactionConfig;
      if (!reaction) {
        embed.setDescription(`Указанной вами реакции не существует`);
      } else {
        embed.addFields(
          {
            name: `> Название реакции (оригинальное)`,
            value: `\`${reaction.api_name}\``,
            inline: true,
          },
          {
            name: `> Действие`,
            value: `\`${reaction.action}\``,
            inline: true,
          },
          {
            name: `> Альтернативные способы написания`,
            value: reaction.aliases.length
              ? reaction.aliases.map((alias) => `\`${alias}\``).join(", ")
              : "Нет",
            inline: false,
          },
          {
            name: `> Обязательность пинга`,
            value: reaction.everyone ? "Нет" : "Да",
            inline: true,
          },
          {
            name: `> Является ли реакция принимаемой`,
            value: reaction.isAcceptable ? "Да" : "Нет",
            inline: true,
          }
        );
      }
      return interaction.editReply({ embeds: [embed] });
    } else {
      const categories: Record<string, ReactionConfig[]> = {
        love: [],
        action: [],
        emotion: [],
      };

      Object.values(reactions).forEach((reaction: ReactionConfig) => {
        categories[reaction.type].push(reaction as any);
      });

      Object.keys(categories).forEach((category) => {
        const reactionList = categories[category];
        reactionList.sort((a, b) => a.api_name.localeCompare(b.api_name));

        const reactionsChunk = reactionList
          .map(
            (reaction, index) =>
              `${bold(`${index + 1}.`)} \`${
                reaction.api_name
              }\` — ${reaction.action[0].toUpperCase()}${reaction.action.slice(
                1
              )}`
          )
          .join("\n");

        embed.addFields({
          name: `Категория: ${category[0].toUpperCase()}${category.slice(1)}`,
          value: reactionsChunk,
        });
      });

      return interaction.editReply({
        embeds: [embed],
      });
    }
  }
}
