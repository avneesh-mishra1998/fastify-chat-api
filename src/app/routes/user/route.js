const controller = require("../../controllers/user/user.controller")
const schema = require('./schema')



module.exports = function(fastify, opts, done){

    fastify.post("/user/get-user", {
        onRequest: [fastify.authenticate],
        schema: schema.get_user_details,
        handler: controller._get_user
    })

    

    done()
}


