const response_states = require("../common_schema/response")
const header_states = require("../common_schema/header")
  
const userId = {
  type: 'object',
  properties: {
    receiver_id: {type: "number"},
  },
  required: ['receiver_id']
}
const participant_ids = {
  type: 'object',
  properties: {
    participants_id: {type: "string"},
  },
  required: ['participants_id']
}
const chatId = {
  type: 'object',
  properties: {
    chat_id: {type: "number"},
  },
  required: ['chat_id']
}
const chatName = {
  type: 'object',
  properties: {
    group_name: {type: "string"},
  },
}
const group_params = {
  type: 'object',
  properties: {
    participants: {type: "String"},
    // selection: {
    //   type: "string",
    //   enum: ["Group chat", "One on one chat"],
    //   description: "Select your chat name",
    // },
    group_Name: {type: "String"}
  },
  required: ['participants']
}

  
  module.exports = {
    retrieve_data: {
      description: 'Get All User',
      tags: ['Chat'],
      summary: 'Retrieve users',
      headers: header_states,
      response: response_states
    },
    create_one_on_one_chat_schema: {
      description: 'Get All User Chats',
      tags: ['Chat'],
      summary: 'Get All Chats By A User',
      params: userId,
      headers: header_states,
      response: response_states
    },
    get_all_chat_schema: {
      description: 'Get All User Chats',
      tags: ['Chat'],
      summary: 'Get All Chats By A User',
      headers: header_states,
      response: response_states
    },
    get_chat_by_id_schema: {
      description: 'Get Group Chats by id',
      tags: ['Chat'],
      summary: 'Get All Chats of a group',
      params: chatId,
      headers: header_states,
      response: response_states
    },
    create_group_chat_schema: {
      description: 'Create a group chat',
      tags: ['Chat'],
      summary: 'Create a group chat with name and participants',
      params: group_params,
      headers: header_states,
      response: response_states
    },
    rename_group_chat_schema: {
      description: 'Rename a group chat',
      tags: ['Chat'],
      summary: 'Rename a group name',
      params: chatId,
      body: chatName,
      headers: header_states,
      response: response_states
    },
    add_new_participants: {
      description: 'Add new participants in group chat',
      tags: ['Chat'],
      summary: 'Add new participants in group chat',
      params: chatId,
      body: participant_ids,
      headers: header_states,
      response: response_states
    },

  };


  