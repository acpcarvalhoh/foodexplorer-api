const fs = require('fs');
const path = require("path");
const uploadsconfig = require("../configs/dishUloads");

class Diskstorage{
    async save(file){
        await fs.promises.rename(
            path.resolve(uploadsconfig.TMP_FOLDER, file),
            path.resolve(uploadsconfig.UPLOADS_FOLDER, file),

        );

        return file;
    };



    async delete(file){
      
        const fileToDelete = path.resolve(uploadsconfig.UPLOADS_FOLDER, file);
            
        try{
            fs.promises.stat(fileToDelete);


        }catch{
            return
        }

        await fs.promises.unlink(fileToDelete);
        

       
    };


};




module.exports = Diskstorage;