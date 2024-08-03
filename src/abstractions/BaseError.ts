import { ErrorConfig } from "@/types/options";
import { EmbedBuilder } from "discord.js";

export class BaseCommandError {
  declare readonly options: ErrorConfig;
  constructor(options: ErrorConfig) {
    this.execute(options);
  }

  private execute(options: ErrorConfig) {
    try {
      const { interaction, title, description, color } = options;
      const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setThumbnail(interaction.user.displayAvatarURL());
      const data = {
        embeds: [embed],
        components: [],
      };
      if (options.isMustReply) {
        return interaction.reply({ ...data, ephemeral: options.ephemeral });
      }
      if (interaction.deferred) {
        try {
          return interaction.editReply(data);
        } catch {
          try {
            return interaction.followUp(data);
          } catch {
            return;
          }
        }
      }
      if (interaction.replied) {
        try {
          return interaction.editReply(data);
        } catch {
          return;
        }
      } else {
        return interaction.reply(data);
      }
    } catch (err) {}
  }
}
