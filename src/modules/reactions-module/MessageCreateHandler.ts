import BaseEvent from "@/abstractions/BaseEvent";
import { GuildModel } from "@/models/GuildsModel";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  Events,
  Message,
  TextChannel,
  userMention,
} from "discord.js";
import reactions from "./configs/react.json";
import reactionsLinks from "./configs/reactlink.json";
import { findReactionByAliases, ReactionConfig } from "./ReactionTypes";
import axios from "axios";
import { SnowflakeColors } from "@/enums";
import { randomValue } from "@/utils/functions/random";
import { ReactionModuleModel } from "@/models/ReactionsModel";

const API_URL = "https://api.otakugifs.xyz/gif?reaction=";

export class MessageReactionHandler extends BaseEvent {
  constructor() {
    super({
      name: Events.MessageCreate,
      once: false,
    });
  }

  private async getReactionConfig(reactionCommand: string): Promise<ReactionConfig | undefined> {
    const reactionKey = reactions[reactionCommand]
      ? reactionCommand
      : findReactionByAliases(reactionCommand, reactions as any);
    return reactions[reactionKey] as ReactionConfig;
  }

  private createEmbed(msg: Message, reactionConfig: ReactionConfig, url: string) {
    return new EmbedBuilder()
      .setTitle(`Реакция - ${reactionConfig.action.toLowerCase()}`)
      .setColor(SnowflakeColors.DEFAULT)
      .setFooter({
        iconURL: msg.author.displayAvatarURL(),
        text: msg.author.globalName,
      })
      .setTimestamp(new Date())
      .setImage(url);
  }

  private async handleButtonInteraction(
    collector: ReturnType<Message["createMessageComponentCollector"]>,
    embed: EmbedBuilder,
    msg: Message,
    pingedUser: any,
    reactionConfig: ReactionConfig,
    url: string
  ) {
    let isClicked = false;
    collector.once("collect", async (inter) => {
      if (inter.user.id === pingedUser.id) {
        await inter.deferUpdate();
        isClicked = true;
        inter.editReply({
          embeds: [
            inter.customId === "reaction_accept"
              ? embed
                  .setDescription(
                    `Пользователь ${userMention(msg.author.id)} ${
                      reactionConfig.verbal
                    } ${reactionConfig.memberVerb} ${userMention(pingedUser.id)}`
                  )
                  .setThumbnail(null)
              : embed.setDescription(
                  `Пользователь ${userMention(pingedUser.id)} отклонил Вашу реакцию`
                ),
          ],
          components: [],
        });
      }
    });

    collector.once("end", () => {
      if (!isClicked) {
        msg.edit({
          embeds: [
            embed.setDescription(
              `Пользователь ${userMention(pingedUser.id)} проигнорировал или не увидел Вашей реакции`
            ),
          ],
          components: [],
        });
      }
    });
  }

  public async execute(msg: Message) {
    const guild = await GuildModel.findOne({ guildId: msg.guild.id });
    const reactionModule = await ReactionModuleModel.findOne({ guildId: msg.guild.id });
    if (!reactionModule?.enable || !msg.content.startsWith(guild.prefix)) return;

    const content = msg.content.split(" ");
    const reactionCommand = content[0].slice(1);
    const reactionConfig = await this.getReactionConfig(reactionCommand);
    if (!reactionConfig) return;

    const channel = msg.channel as TextChannel;
    if (
      (reactionConfig.nsfw && !channel.nsfw && !reactionModule.nsfwReactions.includes(channel.id)) ||
      !reactionModule.commonReactions.includes(channel.id)
    )
      return;

    const url = reactionConfig.isApi
      ? (await axios.get(`${API_URL}${reactionCommand}`)).data.url
      : randomValue(reactionsLinks[reactionCommand]);

    const embed = this.createEmbed(msg, reactionConfig, url);
    const pingedUser = msg.mentions.users.first();
    let components;

    if (pingedUser) {
      if (pingedUser.bot) {
        embed.setThumbnail(msg.author.displayAvatarURL()).setDescription(
          `Боты не люди, поэтому не получится использовать эту реакцию на мне : (\n Однако если ты выберешь пользователя, то всё обязательно получится!`
        );
      } else if (pingedUser.id === msg.author.id) {
        embed.setThumbnail(msg.author.displayAvatarURL()).setDescription(
          `Я понимаю, что Вам одиноко, но быть может Вы выберете другого пользователя?`
        );
      } else if (reactionConfig.isAcceptable) {
        embed.setThumbnail(msg.author.displayAvatarURL()).setDescription(
          `Эй, ${userMention(pingedUser.id)},  пользователь ${userMention(
            msg.author.id
          )} ${reactionConfig.message}.\n Что скажешь?`
        );
        components = [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId("reaction_accept")
              .setStyle(ButtonStyle.Secondary)
              .setEmoji("✅"),
            new ButtonBuilder()
              .setCustomId("reaction_decline")
              .setStyle(ButtonStyle.Secondary)
              .setEmoji("❌")
          ),
        ];
      } else {
        embed.setDescription(
          `Пользователь ${userMention(msg.author.id)} ${reactionConfig.verbal} ${reactionConfig.memberVerb} ${userMention(pingedUser.id)}`
        );
      }
    } else if (reactionConfig.everyone) {
      embed.setDescription(
        `Пользователь ${userMention(msg.author.id)} ${reactionConfig.verbal} ${reactionConfig.everyoneVerb}`
      );
    } else {
      return;
    }

    const reply = await msg.reply({ embeds: [embed], components });
    if (components) {
      const collector = reply.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 15_000,
      });
      await this.handleButtonInteraction(collector, embed, msg, pingedUser, reactionConfig, url);
    }
  }
}