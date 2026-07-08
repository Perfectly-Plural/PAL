module.exports = {
    name: "Control Data",

    description: "Adds more value or sets a new value to the data.",

    category: "Data Stuff",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Acceptable Types: Action\n\nDescription: Executes this block.",
            types: ["action"]
        },
        {
            id: "name",
            name: "Name",
            description:
                "Acceptable Types: Text, Unspecified\n\nDescription: The name for this data.",
            types: ["text", "unspecified"],
            required: true
        },
        {
            id: "value",
            name: "Value",
            description:
                "Acceptable Types: Unspecified, Undefined, Null, Object, Boolean, Date, Number, Text, List\n\nDescription: The value for this data.",
            types: [
                "unspecified",
                "undefined",
                "null",
                "object",
                "boolean",
                "date",
                "number",
                "text",
                "list"
            ],
            required: true
        },
        {
            id: "target",
            name: "Server/Member/User",
            description:
                'Acceptable Types: Object, Text, Unspecified\n\nDescription: The server/member/user for the data. Supports server/member/user ID. Use this input if you have NOT select the option "None" in "Data Type".',
            types: ["object", "text", "unspecified"]
        }
    ],

    options: [
        {
            id: "action_type",
            name: "Action Type",
            description:
                'Description: The type of action for this data. If "Add", inserted a number in the "Value" input add to the current number in the data or use a negative number to subtract.',
            type: "SELECT",
            options: {
                set: "Set",
                add: "Add"
            }
        },
        {
            id: "data_type",
            name: "Data Type",
            description:
                'Description: The type of this data. If not "None", you need to put a value in the "Server/Member/User" input depending on which option you selected here.',
            type: "SELECT",
            options: {
                none: "None",
                server: "Server",
                member: "Member",
                user: "User"
            }
        }
    ],

    outputs: [
        {
            id: "action",
            name: "Action",
            description:
                "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            types: ["action"]
        }
    ],

    code(cache) {
        const name = this.GetInputValue("name", cache) + ""
        let value = this.GetInputValue("value", cache)
        const target = this.GetInputValue("target", cache)
        const action_type = this.GetOptionValue("action_type", cache) + ""
        const data_type = this.GetOptionValue("data_type", cache) + ""

        let id
        switch (data_type) {
            case "server":
            case "user":
                id = typeof target == "object" ? target.id : target
                break
            case "member":
                id = typeof target == "object" ? target.id + target.guild.id : target
                break
        }

        if (action_type === "add") {
            const data = this.getData(name, id, data_type)
            const newValue = data + value
            if (
                typeof data === typeof newValue &&
                (typeof newValue !== "number" || !isNaN(newValue))
            ) {
                value = newValue
            }
        }

        this.setData(name, value, id, data_type)

        this.RunNextBlock("action", cache)
    }
}
