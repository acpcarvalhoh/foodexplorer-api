const AppError = require("../utils/AppError");

function verifyUserAuthorization(roleToVerify){
    return (request, response, next) => {
        const { role } = request.user;
        if(role !== roleToVerify){
            throw new AppError("Acesso não autorizado", 403);
        };


        return next();
    };
};


module.exports = verifyUserAuthorization;