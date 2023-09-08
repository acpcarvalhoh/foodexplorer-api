const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class DishesController{
    async create(request, response){
        const { name, image, description, ingredients, categories, price } = request.body;

        const admin_id = 1;

        const checkDishExist = await knex("dishes").where({ name }).first();

       
        if(checkDishExist){
            throw new AppError("Você já cadastrou um prato com esse nome", 409);
        };

        const [dish_id] = await knex("dishes").insert({
            name, image, description, price, admin_id
        });

        const ingredientsInsert = ingredients.map(name => {
            return {
                dish_id,
                name,
            };
        });

        await knex("ingredients").insert(ingredientsInsert);

        const categoriesInsert = categories.map(name => {
            return {
                dish_id,
                name,
            };
        });

        await knex("categories").insert(categoriesInsert);
                
        response.status(200).json({ message: "Prato cadastrado com sucesso" })

       
    };

    async update(request, response){

    };
};


module.exports = DishesController;