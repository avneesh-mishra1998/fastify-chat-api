const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
module.exports= {
    generateAccessToken : (user) => {
        return global.app.jwt.sign(
            {
                id: user.id,
                username: user.username,
                role: user.role,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
        )
    },
    generateRefreshToken : (user) => {
        return global.app.jwt.sign(
            {
                id: user.id,
            },
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
        )
    },
    get_user_for_register : async(body)=>{
        const user = prisma.user.findFirst({ 
            where: {
                OR: [
                    {phone:body.phone},
                    {username: body.username}
                ]
            }
        })
        return user
    },
    isPasswordCorrect : async(password,DBpassword) => {
        return await bcrypt.compare(password, DBpassword)
    },

   hashPassword : async(password)=> await bcrypt.hash(password, 10)


}