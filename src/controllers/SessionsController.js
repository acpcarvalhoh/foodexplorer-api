const { compare } = require("bcrypt");
const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const authConfig = require("../configs/auth");
const { sign } = require("jsonwebtoken");

class SessionsController{
    async create(request, response){

      /*   try { */
                const { email, password } = request.body;
            const user = await knex("userRoles").where({ email }).first();

            if(!user){
                throw new AppError("Usuário não encontrado", 401);
            };


            const isMatchPassword = await compare(password, user.password);

            if(!isMatchPassword){
                throw new AppError("Email e/ou senha inconrretos", 401);
            }; 

            const { secret, expiresIn } = authConfig.jwt;
            const token = sign({ role: user.role }, secret, {
                subject: String(user.id),
                expiresIn,
            });

            return response.json({user, token});
           
        /* } catch (error) {
            console.log(error);
        } */

       
        
    };
};


module.exports = SessionsController;