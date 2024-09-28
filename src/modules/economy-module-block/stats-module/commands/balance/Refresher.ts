import BaseComponent from "@/abstractions/BaseComponent";
import { ButtonInteraction } from "discord.js";
import {
  EconomyBalanceCommandResponse,
  EconomyBalanceCommandTransferButtonResponse,
} from "./Response";

export class EconomyBalanceRefresherButton extends BaseComponent {
  constructor() {
    super({
      customId: "economybalancerefresher",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ButtonInteraction, args: string[]) {
    await interaction.deferUpdate();
    interaction.editReply(
      await EconomyBalanceCommandResponse(interaction, args)
    );
  }
}
export class EconomyBalanceBackButton extends BaseComponent {
  constructor() {
    super({
      customId: "economybalancebackbutton",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ButtonInteraction, args: string[]) {
    await interaction.deferUpdate();
    interaction.editReply(
      await EconomyBalanceCommandResponse(interaction, args)
    );
  }
}

export class EconomyBalanceTransfer extends BaseComponent {
  constructor() {
    super({
      customId: "economybalancetransfer",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ButtonInteraction, args: string[]) {
    await interaction.deferUpdate();
    interaction.editReply(
      await EconomyBalanceCommandTransferButtonResponse(interaction)
    );
  }
}
