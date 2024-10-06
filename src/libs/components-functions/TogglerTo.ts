import { bold } from "discord.js";
import { isEnabled } from "../embeds-functions/isEnabled";

type TogglerParams = {
  interaction: any;
  /**
   * Шаблон для любого тогглера: `Модуль ${module} ${bold(`успешно`)} ${isEnabled(flag)}`
   */
  moduleName: string;
  /**
   * Модель переключатель
   */
  model: any;
  ephemeral?: boolean;
  field?: string;
};

export async function SetTogglerTo(params: TogglerParams) {
  try {
    const { interaction, moduleName, ephemeral, model, field } = params;
    await interaction.deferReply({ ephemeral: !!ephemeral });
    const existed = await model.findOne({ guildId: interaction.guild.id });
    await existed.updateOne({
      [field ? field : "enable"]: !existed.enable,
    });
    interaction.editReply({
      content: `Модуль ${moduleName} ${bold(`успешно`)} ${bold(
        isEnabled(!existed.enable)
      ).toLowerCase()}`,
    });
  } catch {}
}
