// const fs = require("fs")
const fs = require('fs-extra');

module.exports = {
    get_static_file_path : (request, file_name) => {
        return `${request.protocol}://${request.hostname}/images/${file_name}`;
    },
    get_local_path : (file_name) => {
        return `public/images/${file_name}`
    },
    remove_local_file : (local_path) => {
        fs.unlink(local_path, (err)=> {
            if(err) console.log("Error while removing local files", err);
            else{
                console.log("Removed local: ", local_path);
            }
        });
    }

}