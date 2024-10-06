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
  const { interaction, moduleName, ephemeral, model, field } = params;
  const existed = await model.findOne({ guildId: interaction.guild.id });
  await existed.updateOne({
    [field ? field : "enable"]: !existed.enable,
  });
  await interaction.deferReply({ ephemeral: !!ephemeral });
  interaction.editReply({
    content: `Модуль ${moduleName} ${bold(`успешно`)} ${bold(
      isEnabled(!existed.enable)
    ).toLowerCase()}`,
  });
}
