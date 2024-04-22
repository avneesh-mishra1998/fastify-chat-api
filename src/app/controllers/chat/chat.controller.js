const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const utilities = require('../../common-helpers/utilities')
const APP = require('../../SERVICES-LIBRARY/app')
const response = require('../../routes/common_schema/response')

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

// check if group chat exist or not
const ifGroupChatExist = async(chat_id) => {
  const chat = await prisma.chat.findFirst({
    where:{id:chat_id},
    include: {messages: true}
  });
  return chat
}

const _get_all_chats = async (request, reply) => {
  try {
    const user_id = request.user.id;
    // Fetch chats where the user is a participant, sorted by updatedAt
    const chats = await prisma.chat.findMany({
      where: {
        participants: { contains: user_id.toString() }
      },
      orderBy: {
        updated_at: 'desc'
      },
      ...common_aggregation_for_chat()
    });
    reply.send({data: {chats}})
  }
  catch (error) {
    console.log(error);
  }

}

const _create_or_get_one_on_one_chat = async(request, reply) => {
  const {receiver_id} = request.params;
  const receiver = await APP.user.get_requesting_user({id: parseInt(receiver_id)});
  if(!receiver){
    return reply.send({data: "Receiver Does Not Exists"});
  }
  if(receiver.id.toString() === request.user.id.toString()) {
    return reply.send({data: "You can't chat with yourself"});
  }
  let chat = await prisma.chat.findMany({
    where: {
      AND: [
        {isGroupChat: false},
        {participants: {contains:request.user.id.toString()}},
        {participants: {contains: receiver_id}}
      ]
    },
    ...common_aggregation_for_chat()
  });
  if(chat.length){
    return reply.send({data: {chat}});
  }
  const create_new_chat_instance = await prisma.chat.create({
    data: {
      chat_name: "One on one chat",
      participants: [request.user.id, receiver_id].join(),
      admin_id: request.user.id
    }
  });

  let new_chat = await prisma.chat.findMany({
    where: { id: create_new_chat_instance.id},
    ...common_aggregation_for_chat()
  });
  return reply.send({data: {response: new_chat}})
}

const _addNewParticipantsInGroupChat = async(request, reply) => {
  const {chat_id} = request.params;
  const {participants_id} = request.body;

  // Check if chat is group
  const groupChat = await prisma.chat.findFirst({
    where:{
      AND: [
        {id: chat_id},
        {isGroupChat:true}
      ]
    }
  });

  if(!groupChat){
    return reply.send({data:"Group chat does not exist"})
  }

  if(groupChat.admin_id?.toString() !== request.user.id?.toString()){
    return reply.send({data:{response:"You are not the admin"}})
  }

  if(groupChat.participants?.includes(participants_id)){
    return reply.send({data:{response: "Participant already in group chat"}})
  }
  // Update Chat Participants list
  const updateChat = await prisma.chat.update({
    where:{
      id: chat_id
    },
    data: {
      participants: [groupChat.participants.concat(',',participants_id)].join()  //add new users  to existing list of participants
    }
  });
  // Fetch chat after adding a user
  let new_chat = await prisma.chat.findMany({
    where:{
      AND: [
        {id: chat_id},
        {isGroupChat:true}
      ]
    },
    ...common_aggregation_for_chat()
  });
  console.log([groupChat.participants.concat(',',participants_id)].join());
  reply.send({data: {message:"Participant added successfully", response:new_chat}});
}

const _removeOneParticipantsInGroupChat = async(request, reply) => {
  const {chat_id} = request.params;
  const {participants_id} = request.body;

  // Check if chat is group
  const groupChat = await prisma.chat.findFirst({
    where:{
      AND: [
        {id: chat_id},
        {isGroupChat:true}
      ]
    }
  });

  if(!groupChat){
    return reply.send({data:"Group chat does not exist"})
  }

  if(groupChat.admin_id?.toString() !== request.user.id?.toString()){
    return reply.send({data:{response: "You are not the admin"}})
  }

  if(!groupChat.participants?.includes(participants_id)){
    return reply.send({data:{response: "Participant is not in the group chat"}})
  }
  // Remove one participant from participants list of chat and save it to database
  const removeParticipants = groupChat.participants.split(",").filter(item=> item !==participants_id);

  const updateChat = await prisma.chat.update({
    where:{
      id: chat_id
    },
    data: {
      participants: removeParticipants.join(",")
    }
  });
  // Fetch chat after removing user
  let new_chat = await prisma.chat.findMany({
    where:{
      AND: [
        {id: chat_id},
        {isGroupChat:true}
      ]
    },
    ...common_aggregation_for_chat()
  });

  reply.send({data: {message: "Participant removed successfully", response: new_chat}});
}

const _createAGroupChat = async(request, reply)=> {
  const {group_Name, participants} = request.params;
  // check if user is not sendending himself as participants
  if(participants.includes(request.user.id.toString())){
    return reply.send("User cannot be added to his own Group Chat");
  }

  const members = [...new Set([...participants.split(','), request.user.id])];
  console.log(typeof members.join());

  if(members.length < 3){
    return reply.send("Seems like you have passed duplicate participants");
  }

  const groupChat = await prisma.chat.create({
    data: {
      chat_name: group_Name,
      isGroupChat: true,
      participants: members.join(),
      admin_id: request.user.id
    }
  });
  let new_chat = await prisma.chat.findMany({
    where: { id: groupChat.id},
    ...common_aggregation_for_chat()
  });
  reply.send({data: {new_chat}});
}

const _deleteGroupChat = async(request, reply) => {
  const {chat_id} = request.params;

  // check if group chat exist or not
  let isGroup = await ifGroupChatExist(chat_id);
  if(!isGroup){
    return reply.send("Group chat does not exists");
  }

  // check who try to delete the chat is admin or not
  if(isGroup.admin_id?.toString() !== request.user.id?.toString()){
    return reply.send("Only Admin can delete the Group");
  }
  await prisma.chat.delete({where:{id : chat_id}});

  //emit socket event===
  reply.send({data: {data:"Group chat deleted  successfully"}});
}

const _deleteOneOnOneChat = async(request, reply) => {
  const {chat_id} = request.params;

  // check if group chat exist or not
  let isGroup = await ifGroupChatExist(chat_id);
  if(!isGroup){
    return reply.send("Chat does not exists");
  }

  //=== delete attachment file from local space
  // let attachments = [];
  // attachments = attachments.concat(
  //   ...isGroup.messages.map(message=>message.attachments)
  // );

  // attachments.forEach((attachment)=>
  // //  remove attachments from local storage
  // removeLocalFile(attachment.localPath)
  // )

  await prisma.chat.delete({
    where: {id: chat_id}
  })
  // ===>inform other participants
  const otherParticipants = isGroup?.participants.split(',').find(
    (participant)=> participant !== request.user.id.toString()
  );
  console.log(otherParticipants);

  //emit socket event===
  reply.send({data: {response:"Chat deleted  successfully"}});
}

const _getGroupChatDetails = async(request, reply) => {
  const {chat_id} = request.params;
  // Check if chat is group
  const groupChat = await prisma.chat.findFirst({
    where:{
      AND: [
        {id: chat_id},
        {isGroupChat:true}
      ]
    }
  });
  if(!groupChat){
    reply.send({data:{response: "Group chat does not exist"}})
  }
  let new_chat = await prisma.chat.findMany({
    where:{
      AND: [
        {id: chat_id},
        {isGroupChat:true}
      ]
    },
    ...common_aggregation_for_chat()
  });
  
  reply.send({data : {new_chat}});
}

const _leaveGroupChat = async(request, reply) => {
  const {chat_id} = request.params;

   // Check if chat is group
   const groupChat = await prisma.chat.findFirst({
    where:{
      AND: [
        {id: chat_id},
        {isGroupChat:true}
      ]
    }
  });

  if(!groupChat){
    return reply.send({data:{response:"Group chat does not exist"}})
  }
  //expression for filter removed user
  const removeParticipants = groupChat.participants.split(",").filter(item=> item !==request.user.id.toString());
  //remove leaved user_id from participants
  const updateChat = await prisma.chat.update({
    where:{
      id: chat_id
    },
    data: {
      participants: removeParticipants.join(",")
    }
  });
  // Fetch chat after removing user
  let new_chat = await prisma.chat.findMany({
    where:{
      AND: [
        {id: chat_id},
        {isGroupChat:true}
      ]
    },
    ...common_aggregation_for_chat()
  });

  reply.send({data: {response: new_chat}});
}

const _renameGroupChat = async(request, reply) => {
  const {chat_id} = request.params;
  const {group_name} = request.body;
  
  // Check if chat is group
  const groupChat = await prisma.chat.findFirst({
    where:{
      AND: [
        {id: chat_id},
        {isGroupChat:true}
      ]
    }
  });
  if(!groupChat){
    reply.send({data:{response: "Group chat does not exist"}})
  }
  // Only Admin can change the name
  if(groupChat.admin_id?.toString() !== request.user.id?.toString()){
    reply.send({data:{response: "You are not the admin"}})
  }

  const updateChat = await prisma.chat.update({
    where:{
      id: chat_id
    },
    data: {
      chat_name: group_name
    }
  });

  let new_chat = await prisma.chat.findMany({
    where:{
      AND: [
        {id: chat_id},
        {isGroupChat:true}
      ]
    },
    ...common_aggregation_for_chat()
  });
  //fetch all participants and fire an broadcast that the group name is now changed
  // =======
  reply.send({data: {new_chat}});
}

const _searchAvailableUsers = async(request, reply) => {
  const users = await prisma.user.findMany({
    where: {
      NOT: {id: request.user.id}
    },
    select: {
      full_name: true,
      avatar: true,
      username: true,
      phone: true
    }
  });
  reply.send({data: {users}})
}


module.exports = {
  _create_or_get_one_on_one_chat,
  _deleteOneOnOneChat,
  _addNewParticipantsInGroupChat,
  _removeOneParticipantsInGroupChat,
  _leaveGroupChat,
  _createAGroupChat,
  _renameGroupChat,
  _deleteGroupChat,
  _getGroupChatDetails,
  _get_all_chats,
  _searchAvailableUsers
}