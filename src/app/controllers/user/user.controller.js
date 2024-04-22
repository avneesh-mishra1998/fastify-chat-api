const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const utilities = require('../../common-helpers/utilities')
const APP = require('../../SERVICES-LIBRARY/app')



const _get_user = async(request, reply)=> {
    // const response = await prisma.user.findFirst({where:{id: request.user.id}});
    const response = await APP.user.get_requesting_user({id:request.user.id});
    delete response.password;
    reply.send({data: response});
}


module.exports = {
    _get_user
}