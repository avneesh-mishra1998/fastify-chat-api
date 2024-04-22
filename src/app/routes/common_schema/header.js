module.exports = {
    type: "object",
    properties: {
      Authorization: {
        description: "The Bearer-token generated after successful login",
        type: "string",
        default: "Bearer ",
      },
    },
    required: ["Authorization"],
  };
