import DiscordEvent from "../../classes/DiscordEvent";
import { ChatInputCommandInteraction, Events } from "discord.js";
import { checkRoles, interactionMemberHasRole } from "../../utils/functions";
import EventOptions from "../../classes/EventOptions";
import CustomClient from "../../classes/CustomClient";
import { roles } from "../../../configuration";

export default class Slash extends DiscordEvent {
  constructor(client: CustomClient) {
    super(client, DiscordEvent.interactionOptions);
  }
  async Execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.isChatInputCommand()) return;
    let command: any | null = this.client.commands.get(interaction.commandName);
    if (!command) {
      await interaction.reply(DiscordEvent.defaultResponse);
      return;
    }
    try {
      if (
        interaction.memberPermissions!.has("Administrator") ||
        checkRoles(interaction, roles[interaction.commandName] as string[]) ||
        (interaction.commandName == "developer" &&
          interaction.member!.user.id == process.env.DEVELOPER_ID)
      ) {
        let subcommand: any;
        try {
          subcommand = interaction.options.getSubcommand();
        } catch (e) {
          await command.execute(interaction, this.client);
        }
        if (subcommand) {
          subcommand = this.client.subcommands.get(
            `${interaction.commandName}.${subcommand}`
          );
          await subcommand.execute(interaction, this.client);
        }
      } else {
        await interaction.reply({
          ephemeral: true,
          content: `You don't have permissions to execute this command.`,
        });
      }
    } catch (error) {
      console.error(error);
      const content = {
        content: `There's been an errror exectuing the command`,
        ephemeral: true,
      };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(content);
      } else {
        await interaction.reply(content);
      }
    }
  }
}
