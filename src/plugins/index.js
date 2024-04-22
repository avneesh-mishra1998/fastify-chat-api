
const fp = require("fastify-plugin");
module.exports = fp(async function (fastify, opts) {
    fastify.decorate("authenticate", async function (request, reply) {
        try {
            let user = await request.jwtVerify();
            // const status = await security.getSessionState(user.session || null);
            if (!user) {
                throw new Error('Session has expired for the user.');
            }
        } catch (err) {
            return reply.code(403).send({message: err.message, error: err});
        }
    });
});
