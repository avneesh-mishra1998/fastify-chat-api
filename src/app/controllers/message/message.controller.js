const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const utilities = require('../../common-helpers/utilities')
const APP = require('../../SERVICES-LIBRARY/app')
const response = require('../../routes/common_schema/response')
const helper = require('./helper')
const socket = require('../../socket/index')


// Common statement for fetching chat with details
const common_aggregation_for_chat = () => {
    return {
      include: {
        admin: {
          select: {
            username: true,
            avatar: true,
            phone: true
          }
        },
        messages: {
          select: {
            content: true,
            attachments: true,
            sender: {
              select: {
                username: true,
                avatar: true,
                phone: true
              }
            }
          }
        }
      }
    }
  }

const _get_all_message = async(request, reply) => {
    const {chat_id} = request.params;

    const is_chat = await prisma.chat.findFirst({
        where: {id: chat_id}
    })
    if(!is_chat){
        return reply.send({data: {response: "Chat does not exists"}});
    }
    // Only send message if the logged in user  is a member of this chat
    if(!is_chat.participants?.includes(request.user.id.toString())){
        return reply.send({data: {response: "User is not a part of this chat"}})
    }

    const chat = await prisma.chat.findFirst({
        where: {id: chat_id},
        ...common_aggregation_for_chat()
    })
    reply.send({data: {response: chat}});
}

const _send_message = async(request, reply) => {
    const {chat_id} = request.params;
    const {content} = request.body;

    if(!content && !request.files.attachments?.length){
        return reply.send({data: {response: "Please type something or select aan attachment"}})
    }
    // Create a new message instance
    let new_message = await prisma.chatMessage.create({
        data: {
            sender_id: request.user.id,
            chat_id: chat_id,
            content: content || "images",
        }
    });
    reply.send({data: {response: "Success"}})
}

// const _send_message = async(request,connection) =>{
//   // console.log(connection);
//   return request.user.id
// }

const _send_images = async(request, reply) => {
  const {chat_id} = request.params;

  const message_files = [];
    if(request.files && request.files.attachments?.length>0){
        request.files.attachments?.map((attachments)=> {
            message_files.push({
                url: helper.get_static_file_path(request, attachments.filename),
                localPath: helper.get_local_path(attachments.filename) || attachments.path
            });
        })
    }
  // Create a new message instance
  let new_message = await prisma.chatMessage.create({
    data: {
        sender_id: request.user.id,
        chat_id: chat_id,
        content: "image",
    }
  });

  // // Add attachments if any
  message_files.forEach(async(element) => {
    await prisma.attachments.create({
      data: {
          chat_message_id: new_message.id,
          url: element.url,
          localPath: element.localPath
      },
    });
    console.log(element);
  });
  reply.send({data: {response: request.files.attachments}});
}

module.exports = {
    _get_all_message,
    _send_message,
    _send_images
}