import BaseComponent from "@/abstractions/BaseComponent";
import { TeleportModel } from "@/db/models/teleport/TeleportModel";
import { ChannelSelectMenuInteraction } from "discord.js";

export class TeleportEmbedSelectMenu extends BaseComponent {
  constructor() {
    super({
      customId: "tpchsl",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ChannelSelectMenuInteraction, args: string[]) {
    await interaction.deferReply({ ephemeral: true });
    const field = args[0];
    const id = args[1];
    const once = args[2]
    const values = interaction.values;
    console.log(field, id, once, values);
    await TeleportModel.updateOne(
      {
        _id: id,
      },
      {
        [field]: once === "true" ? values[0] : values,
      }
    );
    return interaction.editReply({ content: `Данные успешно обновлены` });
  }
}
