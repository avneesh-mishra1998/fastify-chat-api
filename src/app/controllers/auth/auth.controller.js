const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const utilities = require('../../common-helpers/utilities')
const APP = require('../../SERVICES-LIBRARY/app')
const preset_numbers = ["+919198455118", "+919876543210"]



const _register = async(request, reply) => {
    const body = request.body
    let password = await APP.auth.hashPassword(body.password)
    body.password = password;
    try {
        const isUser = await APP.auth.get_user_for_register(body);
        if(isUser){
            return reply.status(422).send({message:'Phone number already exists please login'})
        }else{
            const user = await prisma.user.create({ data: body });
            delete user.password ;
            const createdUser = await APP.user.get_requesting_user({id: user.id});
            delete createdUser.password;
            if(!createdUser){
                return reply.status(422).send({message:'Something went wrong while registering'});
            }
            reply.send({data: {user, createdUser}})
        }
    } catch (error) {
        console.log(...error);
    }
}

const _login = async(request, reply) => {
    try {
        let response = {}
        const { username, phone, password } = request.body;
        if(!username && !phone){
            return reply.status(422).send({message:'username or phone is required for login'})
        }
        const isUser = await APP.auth.get_user_for_register(request.body);
        console.log(isUser);
        if(!isUser){
            return reply.status(404).send({message:'User does not exists'});
        }
        const validPassword = await APP.auth.isPasswordCorrect(password, isUser.password);
        console.log(validPassword, password, isUser.password);
        if (!validPassword) {
            return reply.status(401).send({ message: 'Invalid Password.' });
        }
        // Generate Access Token....
        let token = await APP.auth.generateAccessToken(isUser);

        let refreshToken = await APP.auth.generateRefreshToken(isUser);
        await prisma.user.update({
            where: {phone:isUser.phone},
            data: {refreshToken: refreshToken}
        })
        response.user = isUser;
        response.token = token;
        response.refreshToken = refreshToken;
        return reply.status(200).send({data: response})
        } catch (error) {
            console.log({error: {...error}});
            return reply.code(422).send({error: {message: error.message}});
        }
}

const _assign_role = async(request, reply) => {
    const {role} = request.body;
    const user = await APP.user.get_requesting_user({id:request.user.id});
    if(!user){
        return reply.status(404).send({message:'User does not exists'});
    }
    let updated_user = await APP.user.update_user_data(user.id, role);
    return reply.send({data: `Role changed for the user to ${role}` })
}



module.exports = {
    _register,
    _login,
    _assign_role,
}
