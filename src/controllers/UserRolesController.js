const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const { hash, compare } = require('bcrypt');

class UserRolesController{
    async create(request, response){
        const { name, email, password} = request.body;

        const checkUserExist = await knex("userRoles").where({ email }).first();
        if(checkUserExist){
            throw new AppError("Usuário já existe no bando dados", 409);
        };

        const hashPassword = await hash(password, 8);

        await knex("userRoles").insert({
            name, 
            email, 
            password: hashPassword, 
        });

        return  response.status(200).json({
            message: "Usuário cadastrado",

        });

    };
};

module.exports = UserRolesController;