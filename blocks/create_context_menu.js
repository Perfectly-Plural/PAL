module.exports = {
    name: "Create Context Menu",

    description:
        "Creates a context menu that appears when right-clicking or tapping a user or a message.",

    category: "Command Stuff",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Acceptable Types: Action\n\nDescription: Executes this block.",
            types: ["action"]
        },
        {
            id: "context_menu_name",
            name: "Menu Name",
            description:
                "Acceptable Types: Text, Unspecified\n\nDescription: The name of the context menu.",
            types: ["text", "unspecified"],
            required: true
        },
        {
            id: "context_menu_server",
            name: "Menu Server",
            description:
                "Acceptable Types: Object, Text, Unspecified\n\nDescription: The server (id) to create this context menu in.",
            types: ["object", "text", "unspecified"]
        }
    ],

    options: [
        {
            id: "context_menu_type",
            name: "Menu Type",
            description: "The type of the context menu.",
            type: "SELECT",
            options: {
                2: "User Context Menu",
                3: "Message Context Menu"
            }
        },
        {
            id: "contexts",
            name: "Contexts",
            description: "Description: Where this context menu can be used.",
            type: "MULTISELECT",
            options: [
                ["Guild", "Server"],
                ["BotDM", "Bot DM"],
                ["PrivateChannel", "Other DM"]
            ],
            defaultValue: ["Guild"]
        },
        {
            id: "integration_types",
            name: "Integration Types",
            description: "Description: The integration types of this context menu.",
            type: "MULTISELECT",
            options: [
                ["GuildInstall", "Server Bot"],
                ["UserInstall", "User Bot"]
            ],
            defaultValue: ["GuildInstall"]
        }
    ],

    outputs: [
        {
            id: "action2",
            name: "Action",
            description:
                "Type: Action\n\nDescription: Executes the following blocks whenever this context menu is executed.",
            types: ["action"]
        },
        {
            id: "interaction",
            name: "Interaction",
            description:
                "Type: Object\n\nDescription: The interaction created by executing the context menu.",
            types: ["object"]
        },
        {
            id: "target_message",
            name: "Target Message",
            description:
                "Type: Object\n\nDescription: The target message. [Message Context Menu Only]",
            types: ["object"]
        },
        {
            id: "target_user",
            name: "Target User",
            description: "Type: Object\n\nDescription: The target user. [User Context Menu Only]",
            types: ["object"]
        },
        {
            id: "target_member",
            name: "Target Member",
            description:
                "Type: Object\n\nDescription: The target server member if possible. [User Context Menu Only]",
            types: ["object"]
        }
    ],

    async code(cache) {
        const DiscordCommands = await this.getDependency("DiscordCommands", cache.name)

        const { ContextMenuCommandBuilder } = require("discord.js")

        const context_menu_name = this.GetInputValue("context_menu_name", cache).trim()
        const context_menu_server = this.GetInputValue("context_menu_server", cache)
        const context_menu_type = Number(this.GetOptionValue("context_menu_type", cache))
        const contexts = this.GetOptionValue("contexts", cache)
        const integration_types = this.GetOptionValue("integration_types", cache)

        const contextMenuServerId = context_menu_server?.id || context_menu_server

        const contextMenu = new ContextMenuCommandBuilder()
            .setName(context_menu_name)
            .setType(context_menu_type)
        if (contexts.length > 0) contextMenu.setContexts(...contexts)
        if (integration_types.length > 0) contextMenu.setIntegrationTypes(...integration_types)

        DiscordCommands.create(contextMenu, contextMenuServerId)

        if (this.isOutputConnected("action2", cache)) {
            this.events.on("interactionCreate", (interaction) => {
                if (interaction.commandName === context_menu_name) {
                    if (
                        interaction.commandGuildId &&
                        interaction.commandGuildId !== contextMenuServerId
                    ) {
                        return
                    }

                    switch (context_menu_type) {
                        case 2:
                            if (interaction.isUserContextMenuCommand()) {
                                this.StoreOutputValue(interaction, "interaction", cache)
                                this.StoreOutputValue(interaction.targetUser, "target_user", cache)
                                this.StoreOutputValue(
                                    interaction.targetMember,
                                    "target_member",
                                    cache
                                )
                                this.RunNextBlock("action2", cache)
                            }
                            break
                        case 3:
                            if (interaction.isMessageContextMenuCommand()) {
                                this.StoreOutputValue(interaction, "interaction", cache)
                                this.StoreOutputValue(
                                    interaction.targetMessage,
                                    "target_message",
                                    cache
                                )
                                this.RunNextBlock("action2", cache)
                            }
                            break
                    }
                }
            })
        }
    }
}
