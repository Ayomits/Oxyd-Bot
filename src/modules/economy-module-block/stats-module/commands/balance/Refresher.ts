import BaseComponent from "@/abstractions/BaseComponent";
import { ButtonInteraction } from "discord.js";
import {
  EconomyBalanceCommandResponse,
  EconomyBalanceCommandTransferButtonResponse,
} from "./Response";

export class EconomyBalanceRefresherButton extends BaseComponent {
  constructor() {
    super("economybalancerefresher", 600);
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
    super("economybalancebackbutton", 600);
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
    super("economybalancetransfer", 600);
  }

  async execute(interaction: ButtonInteraction, args: string[]) {
    await interaction.deferUpdate();
    interaction.editReply(
      await EconomyBalanceCommandTransferButtonResponse(interaction)
    );
  }
}
