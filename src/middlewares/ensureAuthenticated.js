const { verify } = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const authConfig = require("../configs/auth");


function ensureAuthenticated(request, response, next) {
    const authHeader = request.headers['Authorization'];

    if (!authHeader) {
        throw new AppError("JWT token invalido", 401);
    };

   const token = authHeader && authHeader.split(" ")[1];
   const { secret } = authConfig.jwt;

   try{
    const { sub: user_id } = verify(token, secret);
    request.user = {
        id: +user_id
    };

    return next();

   }catch(error){
    throw new AppError("Acesso negado", 403);

   };
   
};

module.exports = ensureAuthenticated;
