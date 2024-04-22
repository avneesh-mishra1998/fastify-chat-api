// const app_constants = require("../../constants/application");
const os = require('os');
// const prisma = require(process.cwd() + '/prisma-db.js').prisma;
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// const APP= require("../../OMNIBUS-LIBRARY/app")
const initial_schema = {
    description: "Initial Endpoint.",
    tags: ["Initial"],
    summary: "Initial Endpoint of blazing fast Fastify Server",
    response: {
        200: {
            description: "Continue with the Request", type: "object", properties: {
                status: {type: "boolean", default: true},
                message: {type: "string", default: "app_constants.API_WELCOME_MESSAGE"},
                data: {type: "object", default: {}, additionalProperties: true},
            },
        },
    },
};

const seed_chat_schema = {
    description: "Seeding Endpoint.",
    tags: ["Initial"],
    summary: "Seeding database for chats",
    response: {
        200: {
            description: "Continue with the Request", type: "object", properties: {
                status: {type: "boolean", default: true},
                message: {type: "string", default: "app_constants.API_WELCOME_MESSAGE"},
                data: {type: "object", default: {}, additionalProperties: true},
            },
        },
    },
};

module.exports = function (fastify, opts, done) {
    fastify.get("/", {schema: initial_schema}, async (request, reply) => {
        let payload = {
            api_platform: os.platform(),
            api_load: os.loadavg(),
            free_memory: os.freemem(),
            total_memory: os.totalmem(),
            api_uptime: os.uptime(),
            route: process.env.API_ROUTE,
            version: "1.0.0",
            ip: request.headers['x-forwarded-for'] || request.ip,
            ipRaw: request.raw.ip || '',
            ips: request.ips,
            ipRemote: request.raw.connection.remoteAddress,
            date: new Date()
        };
        // Update here
        return reply.send({data: payload});
    });

    fastify.post("/seed-chat",{schema: seed_chat_schema}, async(request, reply) => {
        try {

            const seed_chat = await prisma.chat.createMany({
                data: [
                  {
                    chat_name: "One on one chat",
                    isGroupChat: false,
                    participants: "2,3",
                    admin_id: 2,
                  },
                  {
                    chat_name: "One on one chat",
                    isGroupChat: false,
                    participants: "2,3",
                    admin_id: 2,
                  },
                  {
                    chat_name: "Group chat",
                    isGroupChat: true,
                    participants: "2,3",
                    admin_id: 2,
                  }
                ]
              });

            const seed_message = await prisma.chatMessage.createMany({
                data: [
                    {
                        sender_id: 2,
                        chat_id: 1,
                        content: "test message",
                    },
                    {
                        sender_id: 2,
                        chat_id: 1,
                        content: "test message-2",
                    },
                    {
                        sender_id: 2,
                        chat_id: 2,
                        content: "test group message-1",
                    },
                    {
                        sender_id: 3,
                        chat_id: 3,
                        content: "test group message-2",
                    }
                ]
            });

            const seed_attachments = await prisma.attachments.createMany({
                data: [
                    {
                        url: "test-url",
                        localPath: "test/path",
                        chat_message_id: 1
                    },
                    {
                        url: "test-url-2",
                        localPath: "test/path-2",
                        chat_message_id: 2
                    },
                    {
                        url: "test-url-group",
                        localPath: "test/path-in-group",
                        chat_message_id: 3
                    },
                    {
                        url: "test-url-group",
                        localPath: "test/path-in-group",
                        chat_message_id: 3
                    },
                    {
                        url: "test-url-group-2",
                        localPath: "test/path-in-group",
                        chat_message_id: 4
                    }
                ]
            })
              
            reply.send({data: {seed_chat, seed_message, seed_attachments}});
        } catch (error) {
            console.log(error);
            reply.send({error: {...error.message}});
        }
    })

    done();
};



