const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const cookie = require("cookie");
const {AvailableChatEvents, ChatEventEnum} = require('./constants');

const mountJoinChatEvent = (socket) => {
    socket.on(ChatEventEnum.JOIN_CHAT_EVENT, (chat_id)=>{
        console.log("User joined chat: ", chat_id);
        socket.join(chat_id)
    });
}

const mountParticipantTypingEvent = (socket) => {
    socket.on(ChatEventEnum.TYPING_EVENT, (chat_id)=>{
        socket.in(chat_id).emit(ChatEventEnum.TYPING_EVENT, chat_id);  // emit to everyone in the same room
    });
}

const mountParticipantStoppedTypingEvent = (socket) => {
    socket.on(ChatEventEnum.STOP_TYPING_EVENT, (chat_id)=>{
        socket.in(chat_id).emit(ChatEventEnum.STOP_TYPING_EVENT, chat_id);  // emit to everyone in the same room
    });
}

const initilizeSocketId = (request,io) => {
    return io.socket.on("connection", async(socket)=>{
        console.log("connected");
        try {
            const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
            let token = cookies?.accessToken;
            if(!token){
                token = socket.handshake.auth?.token;
            }

            if(!token){
                return "An Un-authorized handshake, Token is missing"
            }

            const user = await prisma.user.findFirst({
                where: {id: request.user.id}
            });
            if(!user){
                return "An Un-authorized connection, Token is missing"
            }

            socket.user = user;
            // We are creating a room with user id so that if user is joined but does not have any active chat going on.
            // still we want to emit some socket events to the user.
            // so that the client can catch the event and show the notifications.
            socket.join(user.id.toString());
            socket.emit(ChatEventEnum.CONNECTED_EVENT);
            console.log("user connected USER_ID: ", user.id);

            // Common events that needs to be mounted on the initialization
            mountJoinChatEvent(socket);
            mountParticipantTypingEvent(socket);
            mountParticipantStoppedTypingEvent(socket);

            socket.on(ChatEventEnum.DISCONNECT_EVENT, ()=> {
                console.log("user has disconnected USER_ID:  ", socket.user.id);
                if(socket.user?.id){
                    socket.leave(socket.user.id)
                }
            });
        } catch (error) {
            console.log(error);
            socket.emit(
                ChatEventEnum.SOCKET_ERROR_EVENT,
                error?.message || "Something went wrong while connecting to the socket."
            );
        }
    });
}



const fp = require('fastify-plugin');

module.exports = fp(async function (fastify, opts) {
//   fastify.get('/websocket', { websocket: true }, (connection, req) => {
//     // initilizeSocketId(connection,req)
//     connection.socket.on("connection", (socket)=>{
//         socket.emit("user_connected")
//         console.log("This is connected endpoint", req.user.id);
//     })
//   });

    // Used decorater
    fastify.decorate("socketio", async function (request, connection) {
        try {
            let user = await request.user.id;
            console.log(user);
            if (!user) {
                throw new Error('Session has expired for the user.');
            }else{ initilizeSocketId(connection,request) }
        } catch (err) {
            return new Error('Session has expired for the user.');
        }
    });
});


// // WebSocket plugin
// const fp = require('fastify-plugin');

// module.exports = fp(async function (fastify, opts) {
//   fastify.addHook('onRoute', (routeOptions) => {
//     if (routeOptions.WebSocket) {
//       routeOptions.handler = (connection, req) => {
//         connection.socket.on('message', message => {
//         console.log('Received message for /websocket1:', message);
//         connection.socket.send(message);
//     })  
//       };
//     }
//   });
// });