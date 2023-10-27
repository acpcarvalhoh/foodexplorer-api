const multer = require("multer");
const uploadsConfig = require("../configs/dishUloads");
const uploads = multer(uploadsConfig.MULTER);
const AppError = require("../utils/AppError");

/* Caso o admin decida não trocar a imagem do manteremos a imagem atual */

function imageUploader(request, response, next) {

    console.log(request.file);
    if(request.file){
        uploads.any()

    }else{
        return next();
    }
   
}

module.exports = imageUploader;

