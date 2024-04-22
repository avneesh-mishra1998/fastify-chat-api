const response_states = require("../common_schema/response")
const header_states = require("../common_schema/header")
  
const userId = {
  type: 'object',
  properties: {
    user_id: {type: "number"},
  },
  required: ['user_id']
}

  
  module.exports = {
  //   update: {
  //     description: 'Update Account',
  //     tags: ['User'],
  //     summary: 'Update Account Data, There is no compulsion of sending every set of data , you just need to send anyone or all of them at once.',
  //     body: user_update_schema,
  //     headers: header_states,
  //     response: response_states
  // },
    get_user_details: {
      description: 'Retrieve User Information',
      tags: ['User'],
      summary: 'Retrieve User Information for Authentication',
      // body: user_login_schema,
      headers: header_states,
      response: response_states
    },
  };


  