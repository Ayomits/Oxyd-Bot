import BaseEvent from "@/abstractions/BaseEvent";
import { MarrySettingsModel } from "@/db/models/economy/MarrySettingsModel";
import { MarryModel } from "@/db/models/economy/MaryModel";
import { Events, GuildMember } from "discord.js";

export class GuildMemberRemove extends BaseEvent {
  constructor() {
    super({
      name: Events.GuildMemberRemove,
      once: false,
    });
  }

  async execute(member: GuildMember) {
    const marry = await MarryModel.findOne({
      guildId: member.guild.id,
      $or: [{ partner1Id: member.id }, { partner2Id: member.id }],
    });
    if (marry) {
      const marrySettings = await MarrySettingsModel.findOne({
        guildId: member.guild.id,
      });
      if (marrySettings.marryRole) {
        const marryRole = member.guild.roles.cache.get(marrySettings.marryRole);
        if (!marryRole) return;
        const partnerMember = member.guild.members.cache.get(
          marry.partner1Id === member.id ? marry.partner2Id : marry.partner1Id
        );
        await partnerMember.roles.remove(marryRole);
      }
    }
  }
}
