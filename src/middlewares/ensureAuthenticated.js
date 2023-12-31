const { verify } = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const authConfig = require("../configs/auth");


function ensureAuthenticated(request, response, next) {
    const authHeader = request.headers;

    if (!authHeader.cookie) {
        throw new AppError("JWT token inválido", 401);
    };
   
   const token = authHeader && authHeader.cookie.split("token=")[1];

   const { secret } = authConfig.jwt;

   try{
    const { role, sub: user_id } = verify(token, secret);
    request.user = {
        id: +user_id,
        role
    };

    return next();

   }catch(error){
    throw new AppError("Acesso negado", 403);

   };
   
};

module.exports = ensureAuthenticated;
