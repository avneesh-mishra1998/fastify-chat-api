
//Load all ENV variables from the .env file INSTANTLY
require("dotenv").config();
// Requiring Server JS for all the Initializations regarding server
const { init, run } = require('./server');
// Bling, Start the Server from Server.js
(async () => {
    try {
      const server = await init();
      console.log(server.httpServer);
      await run(server);
    } catch (error) {
      console.log(error, 'Error While Starting the Server!');
      process.exit(1);
    }
  })();
