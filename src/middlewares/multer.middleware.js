const multer = require("fastify-multer");

const storage = multer.diskStorage({
    destination: function (request, file, cb) {
        cb(null,("./public/images"));
    },

    // Store file in .png/.jpg/.jpeg  format instead of binary
    filename: function (request, file, cb) {
        let file_extension = "";
        if(file.originalname.split(".").length > 1){
            file_extension = file.originalname.substring(
                file.originalname.lastIndexOf(".")
            );
        }
        const file_name_without_extension = file.originalname
          .toLowerCase().split(" ").join("_")?.split(".")[0];
        cb(
            null,
            file_name_without_extension + Date.now() + 
            Math.ceil(Math.random() * 1e5) + file_extension
        );  
    },
})

module.exports = {
    upload : multer({
        storage,
        limits: {
            fileSize: 1 * 1000 * 1000,
        }
    })
}