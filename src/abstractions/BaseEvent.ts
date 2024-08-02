import { EventConfig } from "@/types/options";

export default abstract class BaseEvent {
  declare readonly options: EventConfig;
  constructor(options: EventConfig) {
    this.options = options;
  }
  public execute(..._args: any[]) {
    throw new Error("Method not implemented.");
  }
}
