module.exports = {
    name: 'Bot Error [Event]',

    description: 'When there is a bot error, this event will trigger.',

    category: 'Events',

    auto_execute: true,

    inputs: [],

    options: [],

    outputs: [
        {
            id: 'action',
            name: 'Action',
            description:
                'Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.',
            types: ['action']
        },
        {
            id: 'error',
            name: 'Error',
            description:
                'Type: Object, Unspecified\n\nDescription: The error that was caught (Full Error Backtrace).',
            types: ['object', 'unspecified']
        },
        {
            id: 'error_message',
            name: 'Error Message',
            description: 'Type: Text, Unspecified\n\nDescription: The error reason (simplified version).',
            types: ['text', 'unspecified']
        }
    ],

    code(cache) {
        process.on('unhandledRejection', (error) => {
            this.StoreOutputValue(error, 'error', cache)
            this.StoreOutputValue(error.message, 'error_message', cache)
            this.RunNextBlock('action', cache)
        })

        process.on('uncaughtException', (error) => {
            this.StoreOutputValue(error, 'error', cache)
            this.StoreOutputValue(error.message, 'error_message', cache)
            this.RunNextBlock('action', cache)
        })

        this.client.on('error', (error) => {
            this.StoreOutputValue(error, 'error', cache)
            this.StoreOutputValue(error.message, 'error_message', cache)
            this.RunNextBlock('action', cache)
        })
    }
}
