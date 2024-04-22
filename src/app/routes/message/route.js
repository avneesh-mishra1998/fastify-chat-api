const controller = require("../../controllers/message/message.controller")
const schema = require("./schema")


module.exports = function(fastify, opts, done) {
    fastify.get("/message/get-all-messages/:chat_id", {
        onRequest: [fastify.authenticate],
        schema: schema.get_chat_by_id_schema,
        handler: controller._get_all_message
    })

    fastify.post("/message/send-message/:chat_id", {
        onRequest: [fastify.authenticate],
        schema: schema.send_message_schema,
        handler: controller._send_message
    })
    // fastify.post("/message/send-message/", {
    //     onRequest: [fastify.authenticate],
    //     preHandler: fastify.socketio,
    //     // schema: schema.send_message_schema,
    //     handler: controller._send_message,
    //     WebSocket: true
    // })

    fastify.post("/message/upload-attachments/:chat_id", {
        onRequest: [fastify.authenticate],
        schema: schema.upload_attachments_schema,
        preHandler: fastify.uploader.fields([{name: "attachments", maxCount: 5}]),
        handler: controller._send_images
    })


    done();
}