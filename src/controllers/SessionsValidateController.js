const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class SessionsValidateController{
    async index(request, response){
        const id = request.user.id;

        const user = await knex("userRoles").where({ id }).first();

        if(!user){
            throw new AppError("Solicitaçaõ recebida", 403);
        };

        return response.status(200).json();
              
        
    };
};


module.exports = SessionsValidateController;