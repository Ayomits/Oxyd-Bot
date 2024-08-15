import BaseCommand from "@/abstractions/BaseCommand";
import { SnowflakeType } from "@/enums";
import { ClansModel } from "@/models/clans.model";
import { EconomyUserModel } from "@/models/user.model";
import { CanvasServiceInstance } from "@/utils";
import { getFontPath, getImagePath } from "@/utils/canvas/getPath";
import {
  AttachmentBuilder,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { promises } from "fs";

export class ProfileCommand extends BaseCommand {
  constructor() {
    super({
      builder: new SlashCommandBuilder()
        .setName(`profile`)
        .setDescription(`Профиль участника сервера`)
        .addUserOption((option) =>
          option
            .setName(`user`)
            .setDescription(`Чей профиль нужно просмотреть`)
            .setRequired(false)
        ),
      type: SnowflakeType.Everyone,
      isSlash: true,
    });
  }

  async execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const user =
      (await interaction.options.get("user")?.user.fetch()) ||
      (await interaction.user.fetch());
    const dbUser = await EconomyUserModel.findOne({
      guildId: interaction.guild.id,
      userId: user.id,
    });
    if (!dbUser)
      return interaction.editReply({
        content: "Указанного пользователя не существует",
      });
    const clan = await ClansModel.findOne({
      guildId: interaction.guild.id,
      members: user.id,
    });
    const married = dbUser.marry ? dbUser.marry : false;
    const marryUser = married
      ? await EconomyUserModel.findOne({
          guildId: interaction.guild.id,
          userId: married.partnerId,
        })
      : null;
    const marryMember = married
      ? await interaction.guild.members.fetch({
          user: marryUser.userId,
          cache: true,
        })
      : null;
    // font colours
    const textColor = "#F5F2F2";
    const accentColor = "#ffffba";
    const additionalColor = "#777777";
    // font sizes
    const font = (size: number) => `bold ${size} Roboto`;
    const large = 100;
    const big = 60;
    const medium = 40;
    const small = 30;
    const thin = 20;
    const image = await CanvasServiceInstance.generate({
      globalColor: textColor,
      width: 1920,
      height: 1080,
      globalFont: font(large),
      background: await promises.readFile(getImagePath("profile", "png")),
      requiredFonts: [
        { path: getFontPath("DMSans-Bold"), fontName: "DM Sans" },
      ],
      elements: [
        {
          avatar_user: {
            x: 143.7,
            y: 96.5,
            image: {
              url: user.displayAvatarURL({ size: 2048 }),
              width: 370,
              height: 370,
              isRounded: true,
            },
          },
          text_username: {
            x: 700,
            y: 274,
            text: {
              value: user.globalName,
              color: textColor,
            },
          },
          text_status: {
            x: 660,
            y: 334,
            text: {
              font: font(medium),
              value: dbUser.status ? dbUser.status : "Не указано",
              color: additionalColor,
            },
          },
          text_balance: {
            x: 1605,
            y: 264,
            text: {
              font: font(big),
              value: String(dbUser.balance),
              color: accentColor,
            },
          },
        },
      ],
    });
    return interaction.editReply({
      files: [new AttachmentBuilder(image).setName(`profile.png`)],
    });
  }
}
