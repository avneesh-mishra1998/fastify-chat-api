

const fastify = require("fastify");
const jwt = require("@fastify/jwt")
const cors = require("@fastify/cors")
const swagger = require("@fastify/swagger");
const swager_ui = require('@fastify/swagger-ui')
const docPrefix = "/api-documentation"
const routes = require("./app/routes/routes");
const {v4: uuid} = require("uuid");
const autoload = require("@fastify/autoload");
const path = require("path");
const {upload} = require("./middlewares/multer.middleware");
const socket_plugin = require('./app/socket/index')


// ========
const {createServer} = require("http")
const {Server} = require("socket.io")


// ===============================


const swagger_configuration = () => {
    return {
        routePrefix: docPrefix,
        swagger: {
            info: {
                title: process.env.APP_NAME,
                description: "This is a practice apis",
                version: "1.0",
                contact: {
                    name: 'Avneesh M, Demo Project',
                    url: 'https://www.demo.com',
                    email: 'mark28mishra@gmail.com'
                }
            },
            schemes: ['http'],
            consumes: ["application/json"],
            produces: ["application/json"],
            securityDefinitions: {
                apiKey: {
                    type: "apiKey",
                    name: "Authorization",
                    in: "header",
                },
            },
        },
        exposeRoute: true,
        uiConfig: {
            docExpansion: 'none', // expand/not all the documentations none|list|full
            deepLinking: true
        },
    };
};


const init = async () => {
    const app = fastify({
        logger: true,
        genReqId: (req) => {
          req.headers["x-request-id"] || uuid();
      },
    });

  
    const httpServer = createServer(app);
    const io = new Server(httpServer, {
        pingTimeout: 60000,
        cors: {
          origin: process.env.CORS_ORIGIN,
          credentials: true,
        },
      });
    app.register(require('fastify-socket.io'), {
      io: io
    });
    //   app.register(require('@fastify/websocket'), {
    //     options: {maxPayload: 1048576}
    //   })
    //   app.register(socket_plugin);
  app.register(cors);
  app.register(swagger, {})
  app.register(swager_ui, swagger_configuration());

  // For uploading images
  app.register(require('@fastify/multipart'), {
    root: path.join(__dirname, 'public/images'),
   })
   app.uploader = upload;
  

   app.register(jwt, {secret: process.env.ACCESS_TOKEN_SECRET})
   app.register(autoload, {
    dir: path.join(__dirname, "plugins"),
    ignorePattern: /^(__tests__)/,
   });


    app.register(routes);
    // if we want to add hooks
    //app.addHook('function_name', function(){});
    await app.ready()
    return app;
};


const run = (app) =>
    app.listen(
        {port: process.env.PORT, host: process.env.HOST},
        function (err, address) {
            if (err) {
                console.log("informational_constant.SERVER_OFFLINE");
                app.log.error(err);
                process.exit(1);
            }
            global.app = app;
            // global app for fastify
            console.group("fastify-initilization ⚡");
            console.warn("Server is now listening on", address);
            console.log(`${address}${docPrefix}`);
            console.groupEnd("fastify-initilization");
            app.ready((err) => {
                if (err) throw err;
                app.swagger();
            });
        }
    );

module.exports = {init, run};

