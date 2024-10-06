import BaseEvent from "@/abstractions/BaseEvent";
import { GuildModel } from "@/db/models/guilds/GuildsModel";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  Events,
  Message,
  TextChannel,
  User,
  userMention,
} from "discord.js";
import reactions from "./configs/react.json";
import reactionsLinks from "./configs/reactlink.json";
import { findReactionByAliases, ReactionConfig } from "./ReactionTypes";
import axios from "axios";
import { SnowflakeColors } from "@/enums";
import { ReactionModuleModel } from "@/db/models/economy/ReactionsModel";
import { MarryDocument, MarryModel } from "@/db/models/economy/MaryModel";
import {
  marryFormula,
  MarryLimits,
  ReactionsXp,
} from "../../marry-module/module/configs";
import { randomValue } from "@/libs/embeds-functions/random";

const API_URL = "https://api.otakugifs.xyz/gif?reaction=";

export class MessageReactionHandler extends BaseEvent {
  constructor() {
    super({
      name: Events.MessageCreate,
      once: false,
    });
  }

  public async execute(msg: Message) {
    const guild = await GuildModel.findOne({ guildId: msg.guild.id });
    const reactionModule = await ReactionModuleModel.findOne({
      guildId: msg.guild.id,
    });

    if (!reactionModule?.enable || !msg.content.startsWith(guild.prefix))
      return;
    if (!reactionModule?.usePrefix) return;

    const [command, ...args] = msg.content
      .slice(guild.prefix.length)
      .split(" ");
    const reactionKey = reactions[command]
      ? command
      : findReactionByAliases(command, reactions as any);
    const reactionConfig = reactions[reactionKey] as ReactionConfig;

    if (!reactionConfig) return;

    const channel = msg.channel as TextChannel;
    const isNSFW =
      reactionConfig.nsfw &&
      !channel.nsfw &&
      !reactionModule.nsfwReactions.includes(channel.id);
    if (isNSFW || !reactionModule.commonReactions.includes(channel.id)) return;

    const url = reactionConfig.isApi
      ? (await axios.get(`${API_URL}${reactionKey}`)).data.url
      : randomValue(reactionsLinks[reactionKey]);

    const embed = new EmbedBuilder()
      .setTitle(`Реакция - ${reactionConfig.action.toLowerCase()}`)
      .setColor(SnowflakeColors.DEFAULT)
      .setFooter({
        iconURL: msg.author.displayAvatarURL(),
        text: msg.author.username,
      })
      .setTimestamp(new Date());

    const pingedUser = msg.mentions.users.first();
    if (pingedUser) {
      const marriage = await MarryModel.findOne({
        guildId: msg.guild.id,
        $or: [
          { partner1Id: msg.author.id, partner2Id: pingedUser.id },
          { partner1Id: pingedUser.id, partner2Id: msg.author.id },
        ],
      });
      const isMarried = marriage && marriage.type >= 1;

      if (pingedUser.bot) {
        embed.setDescription(`Я не хочу! Я бот, а не человек!`);
      } else if (pingedUser.id === msg.author.id) {
        embed.setDescription(
          `Мне кажется, что вам стоит найти кого-то другого!`
        );
      } else if (reactionConfig.isAcceptable && !isMarried) {
        embed
          .setThumbnail(msg.author.displayAvatarURL())
          .setDescription(
            `Эй, ${userMention(pingedUser.id)}, пользователь ${userMention(
              msg.author.id
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
        await this.handleReactionCollector(
          msg,
          embed,
          row,
          pingedUser,
          reactionConfig,
          url,
          marriage
        );
      } else {
        embed
          .setDescription(
            `Пользователь ${userMention(
              msg.author.id
            )} ${reactionConfig.verbal.toLowerCase()} ${
              reactionConfig.memberVerb
            } ${userMention(pingedUser.id)}`
          )
          .setImage(url);
        await msg.reply({ embeds: [embed] });
        await this.xpAdder(reactionConfig, marriage);
      }
    } else if (reactionConfig.everyone) {
      embed
        .setDescription(
          `Пользователь ${userMention(
            msg.author.id
          )} ${reactionConfig.verbal.toLowerCase()} ${
            reactionConfig.everyoneVerb
          }`
        )
        .setImage(url);
      await msg.reply({ embeds: [embed] });
    }
  }

  private async handleReactionCollector(
    msg: Message,
    embed: EmbedBuilder,
    row: ActionRowBuilder<ButtonBuilder>,
    pingedUser: User,
    reactionConfig: ReactionConfig,
    url: string,
    marriage?: MarryDocument
  ) {
    const reply = await msg.reply({ embeds: [embed], components: [row] });

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
      if (accepted && marriage) {
        await this.xpAdder(reactionConfig, marriage);
      }
      reply.edit({
        embeds: [
          embed
            .setThumbnail(accepted ? null : msg.author.displayAvatarURL())
            .setDescription(
              accepted
                ? `Пользователь ${userMention(
                    msg.author.id
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
    });

    collector.once("end", () => {
      if (isClicked) return;
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
    });
  }
  private async xpAdder(reactionConfig: ReactionConfig, marriage: any) {
    if (marriage && reactionConfig.type === "love") {
      if (marriage.lvl === MarryLimits.LVL_LIMIT) return;
      const xp = ReactionsXp[reactionConfig.api_name];
      const query: any = {
        $inc: {
          xp: xp,
        },
      };
      const formula = marryFormula(marriage.lvl);
      if (marriage.xp + xp >= formula && marriage.lvl < MarryLimits.LVL_LIMIT) {
        query.$inc = {
          lvl: 1,
        };
        query.$set = {
          xp: 0,
        };
      }
      await marriage.updateOne(query);
    }
  }
}
