const response_states = require("../common_schema/response")
const header_states = require("../common_schema/header")


const chatId = {
    type: 'object',
    properties: {
      chat_id: {type: "number"},
    },
    required: ['chat_id']
  }

  const message_body = {
    type: 'object',
    properties: {
      content: {type: "string"},
    },
    required: ['content']
  }

  const upload_body = {
      type: 'object',
      properties: {
        attachments: {
          type: 'array',
          items: { type: 'string', format: 'binary' }
        }
      },
    }




module.exports = {
    get_chat_by_id_schema: {
        description: 'Get Message by id',
        tags: ['Message'],
        summary: 'Get All Message by Id',
        params: chatId,
        headers: header_states,
        response: response_states
      },
      send_message_schema: {
        description: 'Send Message',
        tags: ['Message'],
        summary: 'Send message to the participants',
        params: chatId,
        body: message_body,
        headers: header_states,
        response: response_states
      },
      upload_attachments_schema: {
        description: 'Send Message',
        tags: ['Message'],
        summary: 'Send message to the participants',
        consumes: ['multipart/form-data'],
        params: chatId,
        querystring: upload_body,
        headers: header_states,
        response: response_states
      },

}