import { isArray } from "class-validator";
import { AnySelectMenuInteraction, bold } from "discord.js";

type SetValueParams = {
  interaction: AnySelectMenuInteraction;
  model: any;
  /**
   * Обновляемое поле
   */
  field: string | string[];
  /**
   * первое значение или все?
   */
  once: boolean;
};

export async function SetValue(params: SetValueParams) {
  const { interaction, model, field, once } = params;
  await interaction.deferReply({ ephemeral: true });
  const values = interaction.values;
  const query = {};
  if (isArray(field)) {
    field.map((field) => {
      query[field] = once ? values[0] : values;
    });
  } else {
    query[field] = once ? values[0] : values;
  }
  await model.updateOne({ guildId: interaction.guild.id }, {...query});
  return interaction.editReply({
    content: `Данные ${bold(`успешно`)} обновлены`,
  });
}
