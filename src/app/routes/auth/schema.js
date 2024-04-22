const response_states = require("../common_schema/response")
const header_states = require("../common_schema/header")
  
const userId = {
  type: 'object',
  properties: {
    user_id: {type: "number"},
  },
  required: ['user_id']
}
const create_user_body = {
  type: 'object',
  properties: {
      phone: { type: 'string', description: '+919876543210' },
      time_zone: { type: 'string', description: 'UTC or Asia/Kolkata' },
      username: { type: 'string' },
      password: {type: 'string'}
  },
  required: ['phone', 'time_zone', 'username', 'password']
};
const user_login_body = {
  type: 'object',
  properties: {
    phone: { type: 'string', description: 'User phone number' },
    username: { type: 'string', description: 'Username' },
    password: { type: 'string', description: 'User password' },
  },
  required: ['password']
};

const user_role_body = {
  type: 'object',
  properties: {
    role: {type: "string"},
  },
  required: ['role']
};
  
  module.exports = {
    create: {
      description: 'Create a User',
      tags: ['Authentication'],
      summary: 'Create an App User',
      body: create_user_body,
      response: response_states
    },
      login_user: {
      description: 'Retrieve User Information',
      tags: ['Authentication'],
      summary: 'Retrieve User Information for Authentication',
      body: user_login_body,
      response: response_states
    },
    assign_role_schema: {
        description: "Assign a role to user",
        tags: ['Authentication'],
        summary: 'Assign Role To User',
        // params: userId,
        body: user_role_body,
        headers: header_states,
        response: response_states
    }
  };


  