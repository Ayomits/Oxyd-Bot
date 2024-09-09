import BaseCommand from "@/abstractions/BaseCommand";
import { MarryModel } from "@/db/models/economy/MaryModel";
import { SnowflakeType } from "@/enums";
import {
  AttachmentBuilder,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { marryFormula, MarryType } from "./configs";
import { getFontPath, getImagePath } from "@/utils/canvas/getPath";
import { CanvasServiceInstance } from "@/utils";
import { formatNumber } from "@/utils/functions/formatNumber";
import { calculateTimeDifference } from "@/utils/functions/calculateTimeDifference";
import { MarrySettingsModel } from "@/db/models/economy/MarrySettingsModel";

export class MarryProfile extends BaseCommand {
  constructor() {
    super({
      builder: new SlashCommandBuilder()
        .setName(`marry-profile`)
        .setDescription(`Профиль пары`)
        .addUserOption((option) =>
          option
            .setName(`user`)
            .setDescription(`Чей профиль вы желаете просмотреть`)
        ),
      type: SnowflakeType.Everyone,
      isSlash: true,
    });
  }
  public async execute(interaction: CommandInteraction) {
    const marrySettings = await MarrySettingsModel.findOne({
      guildId: interaction.guild.id,
    });
    if (!marrySettings.enable)
      return interaction.reply({
        content: `Модуль браков не включен на сервере`,
        ephemeral: true,
      });
    const user = interaction.options.get("user")?.user || interaction.user;
    const existed = await MarryModel.findOne({
      guildId: interaction.guild.id,
      $or: [
        {
          partner1Id: user.id,
        },
        {
          partner2Id: user.id,
        },
      ],
    });
    if (!existed) {
      return interaction.reply({
        content: `Указанный пользователь **не** состоит в отношениях`,
        ephemeral: true,
      });
    }
    await interaction.deferReply();
    let stock;
    if (existed.type === MarryType.FRIENDS) {
      stock = getImagePath("marry_profile_friend", "png");
    }
    if (existed.type === MarryType.LOVE) {
      stock = getImagePath("marry_profile_love", "png");
    }
    if (existed.type === MarryType.MARRIAGE) {
      stock = getImagePath("marry_profile_marry", "png");
    }
    const font = (size = 45) => {
      return `bold ${size}px Roboto-Black`;
    };
    const [partner1Id, partner2Id] = [
      interaction.guild.members.cache.get(existed.partner1Id),
      interaction.guild.members.cache.get(existed.partner2Id),
    ];
    if (!partner1Id || !partner2Id)
      return interaction.reply({
        content: `Одного из пользователей отношений **нет** на сервере`,
        ephemeral: true,
      });
    const image = await CanvasServiceInstance.generate({
      background: stock,
      width: 960,
      height: 630,
      globalColor: "#FFFFFF",
      globalFont: font(50),
      requiredFonts: [
        {
          fontName: "Roboto-Black",
          path: getFontPath("Roboto-Black"),
        },
      ],
      elements: [
        {
          avatar_partner1: {
            x: 60,
            y: 85,
            image: {
              url: partner1Id.displayAvatarURL({ size: 4096 }),
              isRounded: true,
              width: 280,
              height: 280,
            },
          },
          avatar_partner2: {
            x: 620,
            y: 83,
            image: {
              url: partner2Id.displayAvatarURL({ size: 4096 }),
              isRounded: true,
              width: 280,
              height: 280,
            },
          },
          text_username1: {
            x: 180,
            y: 420,
            text: {
              value: partner1Id.user.username.slice(0, 10),
            },
          },
          text_username2: {
            x: 760,
            y: 420,
            text: {
              value: partner2Id.user.username.slice(0, 10),
            },
          },
          text_lvl: {
            x: 481,
            y: 78,
            text: {
              font: font(70),
              value: existed.lvl.toString(),
            },
          },
          text_xp: {
            x: 481,
            y: 420,
            text: {
              value: `${formatNumber(existed.xp)}/${formatNumber(
                marryFormula(existed.lvl)
              )}`,
            },
          },
          text_timeDifference: {
            x: 481,
            y: 540,
            text: {
              font: font(35),
              value: calculateTimeDifference(existed.createdAt, new Date()),
            },
          },
        },
      ],
    });
    return interaction.editReply({
      files: [new AttachmentBuilder(image).setName(`marry_profile.png`)],
    });
  }
}
