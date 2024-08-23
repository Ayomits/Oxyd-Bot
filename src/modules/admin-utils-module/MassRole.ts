import BaseCommand from "@/abstractions/BaseCommand";
import { SnowflakeColors, SnowflakeType } from "@/enums";
import SnowflakeParser from "@/utils/parsers/snowflakeParser";
import {
  CommandInteraction,
  EmbedBuilder,
  Message,
  PermissionFlagsBits,
  Role,
  SlashCommandBuilder,
} from "discord.js";

type MassRoleTargetType = "everyone" | "target";
type MassRoleIntentType = "add" | "remove";

export class MassRole extends BaseCommand {
  constructor() {
    super({
      builder: new SlashCommandBuilder()
        .setName(`massrole`)
        .setDescription(`Выдать определённую роль для множества участников`)
        .addRoleOption((option) =>
          option
            .setName(`role`)
            .setDescription(`Желаемая роль`)
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addStringOption((option) =>
          option
            .setName(`type`)
            .setDescription(
              `Выдать сразу всем участникам или определенным лицам`
            )
            .addChoices(
              {
                name: `Для всех`,
                value: `everyone`,
              },
              {
                name: `Для определённых`,
                value: `target`,
              }
            )
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName(`intent`)
            .setDescription(`Выдать или забрать`)
            .addChoices(
              {
                name: `Выдать`,
                value: `give`,
              },
              {
                name: `Забрать`,
                value: `remove`,
              }
            )
            .setRequired(true)
        ),
      type: SnowflakeType.Everyone,
      isSlash: true,
    });
  }

  public async execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const type = interaction.options.get("type")?.value as MassRoleTargetType;
    const intent = interaction.options.get("intent")
      .value as MassRoleIntentType;
    const role = interaction.options.get("role")?.role as Role;
    const embed = new EmbedBuilder()
      .setTitle(`Массовая выдача ролей`)
      .setColor(SnowflakeColors.DEFAULT)
      .setThumbnail(interaction.user.displayAvatarURL())
      .setTimestamp(new Date());

    if (type === "everyone") {
      const repl = await interaction.editReply({
        embeds: [embed.setDescription(`Процесс выдачи ролей... подождите`)],
      });
      const members = await interaction.guild.members.fetch();
      this.assignRoles(members, role, repl, embed, intent);
    } else if (type === "target") {
      const repl = await interaction.editReply({
        embeds: [
          embed.setDescription(
            `В течение минуты через абзац или пробел введите айди/пинги участников, которым Вы желаете выдать роль ${role}`
          ),
        ],
      });
      const collector = interaction.channel.createMessageCollector({
        time: 60_000,
        filter: (msg) => msg.author.id === interaction.user.id,
      });
      let isSended = false;
      collector.once("collect", async (msg) => {
        isSended = true;
        const membersSnowflakes = SnowflakeParser.user(msg.content);
        console.log(membersSnowflakes);
        const validMembers = (await msg.guild.members.fetch()).filter(
          (member) => membersSnowflakes.includes(member.id)
        );
        return this.assignRoles(validMembers, role, repl, embed, intent);
      });
      collector.once("end", () => {
        if (!isSended) {
          repl.edit({ embeds: [embed.setDescription(`Время истекло`)] });
        }
      });
    }
  }

  private async assignRoles(
    members: any,
    role: Role,
    repl: Message,
    embed: EmbedBuilder,
    intent: MassRoleIntentType
  ) {
    let giveCount = 0;
    return await Promise.all([
      members.map((member) => {
        giveCount += 1;
        intent === "add" ? member.roles.add(role) : member.roles.remove(role);
      }),
    ])
      .then(() => {
        repl.edit({
          embeds: [
            embed.setDescription(
              `Процесс выдачи роли ${role} завершён. Количество ${
                intent === "add" ? "выданных" : "забранных"
              } ролей: **${giveCount}**`
            ),
          ],
        });
      })
      .catch((err) => {
        repl.edit({
          embeds: [
            embed.setDescription(
              `Произошла ошибка в момент выдачи ролей...\n${err}`
            ),
          ],
        });
      });
  }
}
