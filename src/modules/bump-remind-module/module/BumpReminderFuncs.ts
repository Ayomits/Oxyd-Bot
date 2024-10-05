import { Job, scheduledJobs, scheduleJob } from "node-schedule";
import {
  MonitoringBots,
  MonitoringBotsObjectType,
  MonitoringBotsObjs,
} from "./MonitoringBots";
import {
  BumpReminderModuleModel,
  BumpReminderModuleDocument,
} from "@/db/models/bump-reminder/BumpReminderModel";
import {
  EmbedBuilder,
  Guild,
  Message,
  roleMention,
  Snowflake,
  TextChannel,
} from "discord.js";
import { SnowflakeColors } from "@/enums";
import { calculateTimeDifference } from "@/libs/embeds-functions/calculateTimeDifference";

export class BumpReminderSchedule {
  private static cache = new Map<string, Job>();

  public static async handleMonitoringMessage(msg: Message) {
    const bumpSettings = await BumpReminderModuleModel.findOne({
      guildId: msg.guild.id,
    });
    if (!bumpSettings || !bumpSettings.enable) return;

    const { author, embeds, guild } = msg;
    const msgEmbed = embeds[0];

    const monitoring = MonitoringBotsObjs[author.id];
    const timestamp = monitoring.timestampFetcher(msg);

    if (this.isSuccess(msgEmbed.description, monitoring)) {
      const pingTime = bumpSettings[monitoring.dbKey].next as Date;
      const difference = calculateTimeDifference(pingTime, new Date());

      const embed = new EmbedBuilder()
        .setTitle(`Система бамп напоминаний`)
        .setDescription(
          `${msg.interaction.user}, спасибо за продвижение нашего сервера на мониторинге ${msg.author} (\`${monitoring.command}\`)!\n\n` +
            `С момента последнего напоминания прошло: ${difference}.`
        )
        .setColor(SnowflakeColors.DEFAULT)
        .setThumbnail(msg.interaction.user.displayAvatarURL())
        .setTimestamp(new Date())
        .setFooter({
          text: msg.interaction.user.globalName,
          iconURL: msg.interaction.user.displayAvatarURL(),
        });
      return await Promise.all([
        msg.channel.send({ embeds: [embed] }),
        this.setNext(bumpSettings, monitoring.dbKey as any, timestamp),
        this.setSchedule(guild, monitoring, timestamp),
      ]);
    } else {
      await Promise.all([
        this.setNext(bumpSettings, monitoring.dbKey as any, timestamp),
        this.setSchedule(guild, monitoring, timestamp),
      ]);
    }
  }

  public static removeAll(guild: Guild) {
    this.removeSchedule(guild, MonitoringBots.DISCORD_MONITORING);
    this.removeSchedule(guild, MonitoringBots.SDC_MONITORING);
    this.removeSchedule(guild, MonitoringBots.SERVER_MONITORING);
  }

  public static setSchedule(
    guild: Guild,
    monitoring: any,
    timestamp: string | number | Date
  ): void {
    this.cancelExistingJob(guild.id, monitoring?.id || monitoring);
    const date = new Date(timestamp);
    const job = scheduleJob(
      date,
      async () => await this.scheduleFunction(guild, monitoring)
    );
    this.cache.set(this.cacheKey(guild.id, monitoring), job);
  }

  public static removeSchedule(guild: Guild, monitoring: any): boolean {
    return !!this.cancelExistingJob(guild.id, monitoring?.id || monitoring);
  }

  private static cancelExistingJob(
    guildId: Snowflake,
    monitoring: MonitoringBotsObjectType
  ): Job | undefined {
    const key = this.cacheKey(guildId, monitoring);
    const job = this.cache.get(key);
    job?.cancel();
    this.cache.delete(key);
    return job;
  }

  private static cacheKey(
    guildId: Snowflake,
    monitoring: MonitoringBotsObjectType
  ): string {
    return `${guildId}_${monitoring.id}`;
  }

  private static async scheduleFunction(
    guild: Guild,
    monitoring: MonitoringBotsObjectType
  ) {
    const bumpSettings = await BumpReminderModuleModel.findOne({
      guildId: guild.id,
    });

    if (!bumpSettings) return;
    if (!bumpSettings.enable) return;

    const pingChannel = guild.channels.cache.get(
      bumpSettings.pingChannelId
    ) as TextChannel;
    if (!pingChannel) return;

    const pingRoles = bumpSettings.pingRoleIds
      .filter((role) => guild.roles.cache.has(role))
      .map(roleMention)
      .join(" ");

    pingChannel.send({
      content: `${pingRoles} пора продвигать сервер \`${monitoring.command}\``,
    });
  }

  private static async setNext(
    bumpSettings: BumpReminderModuleDocument,
    key: keyof BumpReminderModuleDocument,
    nextTimestamp: Date | number | string
  ) {
    await BumpReminderModuleModel.findByIdAndUpdate(bumpSettings._id, {
      $set: {
        [`${key}.next`]: new Date(nextTimestamp),
      },
    });
  }

  static isSuccess(
    description: string,
    bot: MonitoringBotsObjectType
  ): boolean {
    return bot.success.some((desc) => description.includes(desc));
  }
}
