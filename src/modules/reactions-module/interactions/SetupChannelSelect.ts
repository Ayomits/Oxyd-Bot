import BaseComponent from "@/abstractions/BaseComponent";
import { ReactionModuleModel } from "@/models/ReactionsModel";
import {
  ButtonInteraction,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
  RoleSelectMenuInteraction,
  ChannelSelectMenuInteraction,
  AnySelectMenuInteraction,
} from "discord.js";

export class ReactionsChannelsSetup extends BaseComponent {
  constructor() {
    super("setupRolesChannels", 600);
  }

  async execute(interaction: ChannelSelectMenuInteraction, args: string[]) {
    const values = interaction.values;
    const authorId = args[2];
    const field = args[0];
    if (authorId !== interaction.user.id) return;
    await interaction.deferReply({ ephemeral: true });
    await ReactionModuleModel.updateOne(
      {
        guildId: args[1],
      },
      {
        [field]: values,
      }
    );
    return interaction.editReply({
      content: `Каналы успешно установлены! Нажмите на кнопку "обновить" чтобы увидеть изменения!`,
    });
  }
}
