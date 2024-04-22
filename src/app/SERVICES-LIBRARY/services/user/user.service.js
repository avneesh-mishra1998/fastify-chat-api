const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();
// Let the Magic Begin
module.exports = {
    get_requesting_user : async ( search_payload) => {
        let user = await prisma.user.findFirst( { where: {...search_payload} } );
        return user;
    },
    update_user_data : async (user_id, role) => {
        await prisma.user.update({
            where: {id: user_id},
            data: {role: role}
        });
    }

}