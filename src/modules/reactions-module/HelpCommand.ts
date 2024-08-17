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
} from "./ReactionTypes";
import reactions from "./configs/react.json";

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
    await interaction.deferReply();
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
      if (!reaction)
        return interaction.editReply({
          embeds: [
            embed.setDescription(`Указанной вами реакции не существует`),
          ],
        });
      embed.setFields(
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
          value: `${
            reaction.aliases.length >= 1
              ? reaction.aliases.map((alias) => `\`${alias}\`,`).join(" ")
              : "Нет"
          }`,
          inline: false,
        },
        {
          name: `> Обязательность пинга`,
          value: `${reaction.everyone ? "Нет" : "Да"}`,
          inline: true,
        },
        {
          name: `> Является ли реакция принимаемой`,
          value: `${reaction.isAcceptable ? "Да" : "Нет"}`,
          inline: true,
        }
      );
      return interaction.editReply({ embeds: [embed] });
    } else {
      let description = "";
      Object.keys(reactions).forEach((key, index) => {
        const reaction = reactions[key];
        description += `${bold(`${index + 1}.`)} \`${key}\` - ${
          reaction.action
        }\n`;
      });
      return interaction.editReply({
        embeds: [embed.setDescription(description)],
      });
    }
  }
}
