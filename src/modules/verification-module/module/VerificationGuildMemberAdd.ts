import BaseEvent from "@/abstractions/BaseEvent";
import { VerificationModuleModel } from "@/db/models/verification/VerificationModel";
import { Events, GuildMember } from "discord.js";

export class VerificationGuildMemberAdd extends BaseEvent {
  constructor() {
    super({
      name: Events.GuildMemberAdd,
      once: false,
    });
  }

  public async execute(member: GuildMember) {
    const verificationSettings = await VerificationModuleModel.findOne({
      guildId: member.guild.id,
    });
    if (!verificationSettings.giveUnverify) return;
    const unverifyRole = member.guild.roles.cache.get(
      verificationSettings.unverifyRole
    );
    if (!unverifyRole) return;
    member.roles.add(unverifyRole, "Unverify role");
  }
}
