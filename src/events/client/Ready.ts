import DiscordEvent from "../../classes/DiscordEvent";
import CustomClient from "../../classes/CustomClient";
import EventOptions from "../../classes/EventOptions";
import { Events } from "discord.js";
import CommandHandler from "../../handlers/CommandHandler";
import ComponentHandler from "../../handlers/ComponentHandler";
const eventOptions: EventOptions = new EventOptions(Events.ClientReady, true);
export default class Ready extends DiscordEvent {
  constructor(client: CustomClient) {
    super(client, eventOptions);
  }

  async Execute(...args: any[]): Promise<void> {
    console.log("Bot ready");

    const handlers = [
      CommandHandler.getInstance(),
      ComponentHandler.getInstance(),
    ];
    for (const handler of handlers) {
      await handler.loadAll(this.client);
      if (
        "registerCommands" in handler &&
        typeof handler.registerCommands === "function"
      )
        await handler.registerCommands(this.client);
    }
  }
}
