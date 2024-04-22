const controller = require("../../controllers/auth/auth.controller")
const schema = require('./schema')



module.exports = function(fastify, opts, done){
    fastify.post("/users/register", {
        schema: schema.create,
        handler: controller._register
    })

    fastify.post("/users/signin", {
        schema: schema.login_user,
        handler: controller._login
    })

    fastify.post("/user/assign_role", {
        onRequest: [fastify.authenticate],
        schema: schema.assign_role_schema,
        handler: controller._assign_role
    })

    

    done()
}


