const controller = require("../../controllers/chat/chat.controller")
const schema = require('./schema')



module.exports = function(fastify, opts, done){

    fastify.get("/chats/get-all-chats", {
        onRequest: [fastify.authenticate],
        schema: schema.get_all_chat_schema,
        handler: controller._get_all_chats
    })
    fastify.get("/search/users", {
        onRequest: [fastify.authenticate],
        schema: schema.retrieve_data,
        handler: controller._searchAvailableUsers
    })
    fastify.get("/chats/create-one_on_one-chats/:receiver_id", {
        onRequest: [fastify.authenticate],
        schema: schema.get_all_chat_schema,
        handler: controller._create_or_get_one_on_one_chat
    })
    fastify.delete("/chats/delete-one-on-one-chat/:chat_id", {
        onRequest: [fastify.authenticate],
        schema: schema.get_chat_by_id_schema,
        handler: controller._deleteOneOnOneChat
    })
    fastify.get("/group/create/:participants/:group_Name", {
        onRequest: [fastify.authenticate],
        schema: schema.get_all_chat_schema,
        handler: controller._createAGroupChat
    })
    fastify.get("/group/get-group-chat-details/:chat_id", {
        onRequest: [fastify.authenticate],
        schema: schema.get_chat_by_id_schema,
        handler: controller._getGroupChatDetails
    })
    fastify.post("/group/rename-group-chat/:chat_id", {
        onRequest: [fastify.authenticate],
        schema: schema.rename_group_chat_schema,
        handler: controller._renameGroupChat
    })
    fastify.delete("/group/delete-group-chat/:chat_id", {
        onRequest: [fastify.authenticate],
        schema: schema.get_chat_by_id_schema,
        handler: controller._deleteGroupChat
    })
    fastify.post("/group/add-new-participants/:chat_id", {
        onRequest: [fastify.authenticate],
        schema: schema.add_new_participants,
        handler: controller._addNewParticipantsInGroupChat
    })
    fastify.post("/group/remove-participants/:chat_id", {
        onRequest: [fastify.authenticate],
        schema: schema.add_new_participants,
        handler: controller._removeOneParticipantsInGroupChat
    })
    fastify.post("/group/leave-group-chat/:chat_id", {
        onRequest: [fastify.authenticate],
        schema: schema.get_chat_by_id_schema,
        handler: controller._leaveGroupChat
    })

    done();
}

