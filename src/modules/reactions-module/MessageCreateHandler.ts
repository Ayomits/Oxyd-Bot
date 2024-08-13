import BaseEvent from "@/abstractions/BaseEvent";
import { GuildModel } from "@/models/guilds.model";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  Events,
  Message,
  userMention,
} from "discord.js";
import reactions from "./configs/react.json";
import reactionsLinks from "./configs/reactlink.json";
import {
  findReactionByAliases,
  Reaction,
  ReactionConfig,
} from "./ReactionTypes";
import axios from "axios";
import { SnowflakeColors } from "@/enums";

const API_URL = "https://api.otakugifs.xyz/gif?reaction=";

export class MessageReactionHandler extends BaseEvent {
  constructor() {
    super({
      name: Events.MessageCreate,
      once: false,
    });
  }

  public async execute(msg: Message) {
    const guild = await GuildModel.findOne({
      guildId: msg.guild.id,
    });
    if (msg.content.startsWith(guild.prefix)) {
      const content = msg.content.split(" ");
      const reactionCommand = content[0].slice(1);
      const reactionKey = reactions[reactionCommand]
        ? reactionCommand
        : findReactionByAliases(reactionCommand, reactions as any);
      const reactionConfig = reactions[reactionKey] as ReactionConfig;
      if (!reactionConfig) return;
      const url = reactionConfig.isApi
        ? (await axios.get(API_URL + reactionKey))?.data?.url
        : reactionsLinks[reactionKey];
      const embed = new EmbedBuilder()
        .setTitle(`Реакция - ${reactionConfig.action.toLowerCase()}`)
        .setColor(SnowflakeColors.DEFAULT);
      const pingedUser = msg.mentions?.users?.first();
      const res: any = {};
      if (pingedUser) {
        if (pingedUser.bot) {
          embed.setDescription(
            `Я тоже считаю, что боты живые, но может быть Вы выберете пользователя?`
          );
        } else if (pingedUser.id === msg.author.id) {
          embed.setDescription(
            `Я понимаю, что Вам одиноко, но быть может Вы выберете другого пользователя?`
          );
        } else if (reactionConfig.isAcceptable) {
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
          res.components = [row];
        } else {
          embed
            .setDescription(
              `Пользователь ${userMention(msg.author.id)} ${
                reactionConfig.memberVerb
              } ${reactionConfig.verbal} пользователя ${userMention(
                pingedUser.id
              )}`
            )
            .setTimestamp(new Date())
            .setFooter({
              iconURL: msg.author.displayAvatarURL(),
              text: msg.author.globalName,
            })
            .setImage(url);
        }
      } else {
        embed
          .setDescription(
            `Пользователь ${userMention(msg.author.id)} ${
              reactionConfig.verbal
            } ${reactionConfig.everyoneVerb} `
          )
          .setTimestamp(new Date())
          .setFooter({
            iconURL: msg.author.displayAvatarURL(),
            text: msg.author.globalName,
          })
          .setImage(url);
      }
      res.embeds = [embed];
      const reply = await msg.reply(res);
      if (res.components) {
        const collector = reply.createMessageComponentCollector({
          componentType: ComponentType.Button,
          time: 15_000,
        });
        let isClicked = false;
        collector.once("collect", (inter) => {
          if (inter.user.id === pingedUser.id) {
            if (inter.customId === "reaction_accept") {
              isClicked = true;
              reply.edit({
                embeds: [
                  embed
                    .setDescription(
                      `Пользователь ${userMention(msg.author.id)} ${
                        reactionConfig.verbal
                      } ${reactionConfig.everyoneVerb} `
                    )
                    .setTimestamp(new Date())
                    .setFooter({
                      iconURL: msg.author.displayAvatarURL(),
                      text: msg.author.globalName,
                    })
                    .setImage(url),
                ],
              });
            } else if (inter.customId === "reaction_decline") {
              isClicked = true;
              reply.edit({
                embeds: [
                  embed.setDescription(
                    `Пользователь ${userMention(
                      pingedUser.id
                    )} отклонил Вашу реакцию `
                  ),
                ],
              });
            }
          }
        });
        collector.once("end", (reason) => {
          if (!isClicked) {
            reply.edit({
              embeds: [
                embed.setDescription(
                  `Пользователь ${userMention(
                    pingedUser.id
                  )} проигнорировал или не увидел Вашей реакции`
                ),
              ],
            });
          }
        });
      }
    }
  }
}
