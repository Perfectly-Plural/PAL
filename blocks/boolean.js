module.exports = {
    name: "Boolean",

    description: "Creates a boolean to use it in your blocks.",

    category: "Inputs",

    auto_execute: true,

    inputs: [],

    options: [
        {
            "id": "boolean_type",
            "name": "",
            "description": "Description: The boolean to set.",
            "type": "CHECKBOX"
        }
    ],

    outputs: [
        {
            "id": "boolean",
            "name": "Boolean",
            "description": "Type: Boolean\n\nDescription: The boolean.",
            "types": ["boolean"]
        }
    ],

    code(cache) {
        const boolean_type = Boolean(this.GetOptionValue("boolean_type", cache))
        this.StoreOutputValue(boolean_type, "boolean", cache, "inputBlock");
    }
}