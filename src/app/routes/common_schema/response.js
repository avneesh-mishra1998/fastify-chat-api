
const HttpStatusCode = require('http-status-codes');

//--------- success response ------------
const successful_response = {
    description: "Successful Request with data.",
    type: "object",
    properties: {
      status: { type: "boolean", default: true },
      message: { type: "string", default: "Request Successful" },
      data: { type: "object", default: {}, additionalProperties: true },
    },
  };
  const successful_with_no_data_response = {
    description: "Successful Request without data.",
    type: "object",
    properties: {
      status: { type: "boolean", default: true },
      message: {
        type: "string",
        default: "Request is Successful without data",
      },
    },
  };


//   --------Error response-----------

const error_schema = {
    description: "Server Error",
    type: "object",
    properties: {
      status: { type: "boolean", default: false },
      message: { type: "string", default: "Something went wrong, try again. [Server Error]" },
      error: { type: "object", default: {}, additionalProperties: true }
    },
  };
  const forbidden = {
    description: 'Forbidden',
    type: 'object',
    properties: {
      status: { type: 'boolean', default: false },
      message: { type: 'string', default: "Forbidden Request, Access Token needs to be present on headers as Authorization: Bearer <jwt-token>." },
      error: { type: "object", default: {}, additionalProperties: true }
    },
  };
  const unprocessable_entity = {
    description: 'Unprocessable Entity',
    type: 'object',
    properties: {
      status: { type: 'boolean', default: false },
      message: { type: 'string', default: "Unprocessable Entity" },
      error: { type: "object", default: {}, additionalProperties: true }
    },
  };
  
  const bad_request = {
    description: "Bad Request",
    type: "object",
    properties: {
      status: { type: "boolean", default: false },
      message: { type: "string", default: "Bad Request, you should not repeat this request" },
    },
  };
  
  const not_found = {
    description: "Resource Not Found",
    type: "object",
    properties: {
      status: { type: "boolean", default: false },
      message: { type: "string", default: "Not Found, server cannot find the requested resource." },
    },
  };

const response_mediums={
    [HttpStatusCode.OK]: successful_response,
    [HttpStatusCode.NO_CONTENT]: successful_with_no_data_response,
    [HttpStatusCode.FORBIDDEN]: forbidden,
    [HttpStatusCode.UNPROCESSABLE_ENTITY]: unprocessable_entity,
    [HttpStatusCode.BAD_REQUEST]: bad_request,
    [HttpStatusCode.NOT_FOUND]: not_found,
    [HttpStatusCode.INTERNAL_SERVER_ERROR]: error_schema,
}

module.exports={...response_mediums};
