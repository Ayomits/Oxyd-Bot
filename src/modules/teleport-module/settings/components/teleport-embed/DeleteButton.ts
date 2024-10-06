import BaseComponent from "@/abstractions/BaseComponent";
import { SnowflakeColors } from "@/enums";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
} from "discord.js";
import { TeleportEmbedResponse } from "./Response";
import { SetResponseTo } from "@/libs/components-functions/SetResponseTo";
import { TeleportModel } from "@/db/models/teleport/TeleportModel";
import { AllTeleportsResponse } from "../all-teleports-embed/AllTeleportsResponse";

export class TeleportDeleteButton extends BaseComponent {
  constructor() {
    super({
      customId: "teleportembeddeletebutton",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ButtonInteraction, args: string[]) {
    try {
      try {
        await interaction.deferUpdate();
      } catch {}
      const _id = args[0];
      const deleteConfirmCustomId = `teleportembeddeleteconfirm_${Math.random()}`;
      const deleteDeclineCustomId = `teleportembeddeletedecline_${Math.random()}`;
      const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId(deleteConfirmCustomId)
          .setLabel(`Подтвердить`)
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(deleteDeclineCustomId)
          .setLabel(`Отменить`)
          .setStyle(ButtonStyle.Danger)
      );
      const embed = new EmbedBuilder()
        .setTitle(`Вы уверены?`)
        .setDescription(`При удалении телепорта все настройки будут утеряны`)
        .setThumbnail(interaction.user.displayAvatarURL())
        .setColor(SnowflakeColors.DEFAULT)
        .setTimestamp(new Date());
      const repl = await interaction.editReply({
        embeds: [embed],
        components: [buttons],
      });
      const collector = repl.createMessageComponentCollector({
        time: 600_000,
        filter: (i) =>
          i.user.id === interaction.user.id &&
          (i.customId === deleteDeclineCustomId ||
            i.customId === deleteConfirmCustomId),
        componentType: ComponentType.Button,
      });
      collector.on("collect", async (inter) => {
        if (inter.customId === deleteDeclineCustomId) {
          try {
            const replFunc = async () => {
              await TeleportEmbedResponse(inter, _id);
            };
            return await SetResponseTo({
              interaction: inter,
              replFunc,
              defer: {
                update: true,
              },
              ephemeral: true,
            });
          } catch {}
        } else {
          try {
            await TeleportModel.deleteOne({ _id });
            return await SetResponseTo({
              interaction: inter,
              defer: {
                update: true,
              },
              ephemeral: true,
              replFunc: AllTeleportsResponse,
            });
          } catch {}
        }
      });
    } catch {}
  }
}
