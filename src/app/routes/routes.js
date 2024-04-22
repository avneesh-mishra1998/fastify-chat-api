// const {BearerTokenMiddleware} = require('../middlewares/bearer_token');

//initial route (/)

module.exports = function (app, opts, done) {

    //app is fastify here
    app.register(require("./initials/route"));
    app.register(require("./auth/route"), {prefix: process.env.API_ROUTE});
    app.register(require("./user/route"), {prefix: process.env.API_ROUTE});
    app.register(require("./chat/route"), {prefix: process.env.API_ROUTE});
    app.register(require("./message/route"), {prefix: process.env.API_ROUTE});
    
    done();
};
