module.exports = {
    name: "Create Modal",

    description: "Creates a modal for the interaction made by a slash command for example.",

    category: "Command Stuff",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Acceptable Types: Action\n\nDescription: Executes this block.",
            types: ["action"]
        },
        {
            id: "interaction",
            name: "Interaction",
            description:
                "Acceptable Types: Object, Unspecified\n\nDescription: The interaction to create the modal.",
            types: ["object", "unspecified"],
            required: true
        },
        {
            id: "modal_title",
            name: "Modal Title",
            description:
                "Acceptable Types: Text, Unspecified\n\nDescription: The title of the modal.",
            types: ["text", "unspecified"],
            required: true
        },
        {
            id: "modal_timeout",
            name: "Modal Timeout",
            description:
                "Acceptable Types: Number, Unspecified\n\nDescription: The time in seconds to wait before not collecting data and being rejected. Default: 30 minutes.",
            types: ["number", "unspecified"]
        },
        {
            id: "modal_inputs",
            name: "Modal Inputs",
            description:
                "Acceptable Types: Object, Unspecified\n\nDescription: The inputs for the modal.",
            types: ["object", "unspecified"],
            multiInput: true
        }
    ],

    outputs: [
        {
            id: "action",
            name: "Action",
            description:
                "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            types: ["action"]
        },
        {
            id: "action2",
            name: "Action (Submitted)",
            description:
                "Type: Action\n\nDescription: Executes the following blocks when this modal is submitted.",
            types: ["action"]
        },
        {
            id: "interaction",
            name: "Interaction",
            description:
                "Type: Object\n\nDescription: The interaction created by submitting the modal.",
            types: ["object"]
        },
        {
            id: "input_values",
            name: "Input Value",
            description: "Type: Text\n\nDescription: The value of the inputs.",
            types: ["text"],
            multiOutput: true
        }
    ],

    code(cache) {
        const { ModalBuilder, ActionRowBuilder } = require("discord.js")
        const { randomUUID } = require("crypto")

        const interaction = this.GetInputValue("interaction", cache)
        const modal_title = this.GetInputValue("modal_title", cache)
        const modal_timeout = Number(
            this.GetInputValue("modal_timeout", cache, false, 30 * 60) * 1000 // 30 minutes
        )
        const modal_inputs = this.GetInputValue("modal_inputs", cache).filter((a) => a)

        const modalCustomId = randomUUID()

        interaction.showModal(
            new ModalBuilder()
                .setTitle(modal_title)
                .setCustomId(modalCustomId)
                .addComponents(
                    ...modal_inputs.map((modal_input) =>
                        new ActionRowBuilder().addComponents(modal_input)
                    )
                )
        )

        interaction
            .awaitModalSubmit({
                filter: (interaction2) => interaction2.customId === modalCustomId,
                time: modal_timeout
            })
            .then((interaction3) => {
                this.StoreOutputValue(interaction3, "interaction", cache)
                this.StoreOutputValue(
                    interaction3.fields.components.map((c) => c.components[0].value),
                    "input_values",
                    cache
                )
                this.RunNextBlock("action2", cache)
            })
            .catch(() => {})

        this.RunNextBlock("action", cache)
    }
}
