const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class SessionsValidateController{
    async create(request, response){
        const id = request.user.id;
        console.log(id)
        const user = await knex("userRoles").where({ id }).first();

        if(!user){
            throw new AppError("Forbidden", 403);
        };

        return response.status(200).json();
              
        
    };
};


module.exports = SessionsValidateController;