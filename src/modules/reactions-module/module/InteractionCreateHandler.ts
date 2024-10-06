import BaseEvent from "@/abstractions/BaseEvent";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  ComponentType,
  EmbedBuilder,
  Events,
  Interaction,
  TextChannel,
  User,
  userMention,
} from "discord.js";
import reactions from "./configs/react.json";
import reactionsLinks from "./configs/reactlink.json";
import { findReactionByAliases, ReactionConfig } from "./ReactionTypes";
import axios from "axios";
import { SnowflakeColors } from "@/enums";
import { randomValue } from "@/libs/embeds-functions/random";
import { ReactionModuleModel } from "@/db/models/economy/ReactionsModel";
const API_URL = "https://api.otakugifs.xyz/gif?reaction=";

export class MessageReactionHandler extends BaseEvent {
  constructor() {
    super({
      name: Events.InteractionCreate,
      once: false,
    });
  }

  public async execute(interaction: Interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        const command = interaction.commandName;
        const reactionConfig = reactions[command] as ReactionConfig;
        if (!reactionConfig) return;
        const reactionModule = await ReactionModuleModel.findOne({
          guildId: interaction.guild.id,
        });
        if (!reactionModule?.enable) return;
        if (!reactionModule?.useSlash) return;

        const channel = interaction.channel as TextChannel;
        const isNSFW =
          reactionConfig.nsfw &&
          !channel.nsfw &&
          !reactionModule.nsfwReactions.includes(channel.id);
        if (isNSFW || !reactionModule.commonReactions.includes(channel.id))
          return;
        await interaction.deferReply();
        const url = reactionConfig.isApi
          ? (await axios.get(`${API_URL}${command}`)).data.url
          : randomValue(reactionsLinks[command]);
        const embed = new EmbedBuilder()
          .setTitle(`Реакция - ${reactionConfig.action.toLowerCase()}`)
          .setColor(SnowflakeColors.DEFAULT)
          .setFooter({
            iconURL: interaction.user.displayAvatarURL(),
            text: interaction.user.globalName,
          })
          .setTimestamp(new Date());
        const pingedUser = interaction.options.get("user")?.user;
        if (pingedUser) {
          if (pingedUser.bot) {
            embed.setDescription(`Я не хочу! Я бот, а не человек!`);
          } else if (pingedUser.id === interaction.user.id) {
            embed.setDescription(
              `Мне кажется, что вам стоит найти кого-то другого!`
            );
          } else if (reactionConfig.isAcceptable) {
            embed
              .setThumbnail(interaction.user.displayAvatarURL())
              .setDescription(
                `Эй, ${userMention(pingedUser.id)}, пользователь ${userMention(
                  interaction.user.id
                )} ${reactionConfig.message}. Что скажешь?`
              );
            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setCustomId(`reaction_accept`)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("✅"),
              new ButtonBuilder()
                .setCustomId(`reaction_decline`)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("❌")
            );
            return await this.handleReactionCollector(
              interaction,
              embed,
              row,
              pingedUser,
              reactionConfig,
              url
            );
          } else {
            embed
              .setDescription(
                `Пользователь ${userMention(
                  interaction.user.id
                )} ${reactionConfig.verbal.toLowerCase()} ${
                  reactionConfig.memberVerb
                } ${userMention(pingedUser.id)}`
              )
              .setImage(url);
            interaction.editReply({
              content: `${userMention(pingedUser.id)}`,
              embeds: [embed],
            });
          }
        } else if (reactionConfig.everyone) {
          embed
            .setDescription(
              `Пользователь ${userMention(
                interaction.user.id
              )} ${reactionConfig.verbal.toLowerCase()} ${
                reactionConfig.everyoneVerb
              }`
            )
            .setImage(url);
          interaction.editReply({ embeds: [embed] });
        }
      }
    } catch {}
  }

  private async handleReactionCollector(
    interaction: CommandInteraction,
    embed: EmbedBuilder,
    row: ActionRowBuilder<ButtonBuilder>,
    pingedUser: User,
    reactionConfig: ReactionConfig,
    url: string
  ) {
    const reply = await interaction.editReply({
      content: `${userMention(pingedUser.id)}`,
      embeds: [embed],
      components: [row],
    });

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 15000,
      filter: (inter) =>
        inter.user.id === pingedUser.id ||
        global.developers.includes(inter.user.id),
    });
    let isClicked = false;
    collector.once("collect", async (inter) => {
      await inter.deferUpdate();
      const accepted = inter.customId === "reaction_accept";
      isClicked = true;
      try {
        reply.edit({
          embeds: [
            embed
              .setThumbnail(
                accepted ? null : interaction.user.displayAvatarURL()
              )
              .setDescription(
                accepted
                  ? `Пользователь ${userMention(
                      interaction.user.id
                    )} ${reactionConfig.verbal.toLowerCase()} ${
                      reactionConfig.memberVerb
                    } ${userMention(pingedUser.id)}`
                  : `Пользователь ${userMention(
                      pingedUser.id
                    )} отклонил Вашу реакцию`
              )
              .setImage(accepted ? url : null),
          ],
          components: [],
        });
      } catch {}
    });

    collector.once("end", () => {
      if (isClicked) return;
      try {
        reply.edit({
          embeds: [
            embed.setDescription(
              `Пользователь ${userMention(
                pingedUser.id
              )} проигнорировал Вашу реакцию`
            ),
          ],
          components: [],
        });
      } catch {}
    });
  }
}
