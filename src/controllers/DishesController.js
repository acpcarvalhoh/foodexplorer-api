const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const updateCategoriesAndIngredients = require("../utils/dbUtils")

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
        const { name, image, description, ingredients, categories, price } = request.body;
        const { dish_id } = request.params;

        const dish = await knex("dishes").where({ id: dish_id }).first();
       
        if(!dish){
            throw new AppError("Prato não encontrado!!");    
        };

        if (name !== dish.name) {
            const dishWithUpdatedName = await knex("dishes").where({ name }).first();
            
            if (dishWithUpdatedName) {
                throw new AppError("Já existe um prato com este nome!", 409);
            };
        };

        const uniqueCategory = [...new Set(categories)]
        if(uniqueCategory.length !== categories.length){
            throw new AppError("Não é permitido ter categoria duplicada no mesmo prato!", 400);
        }

        const uniqueIngredient = [...new Set(ingredients)]
        if(uniqueIngredient.length !== ingredients.length){
            throw new AppError("Não é permitido ter ingrediente com nome duplicado no mesmo prato!", 400);
        }


        dish.name = name ?? dish.name;
        dish.description = description ?? dish.description;
        dish.image = image ?? dish.image;
        dish.price = price ?? dish.price;

          
        await knex("dishes").where({id: dish_id}).update(dish);
        await updateCategoriesAndIngredients("ingredients", ingredients, dish_id);
        await updateCategoriesAndIngredients("categories", categories, dish_id); 

        return response.status(200).json({message: "Prato atualizado"});

    };


    async show(request, response){
        const { id } = request.params;

        const dish = await knex("dishes").where({ id }).first();
        const ingredients = await knex("ingredients").where({ dish_id: id }).orderBy("name");
        const categories = await knex("categories").where({ dish_id: id }).orderBy("name");

        return response.json({...dish, ingredients, categories});
    };


    async delete(request, response){
        const { id } = request.params;

        await knex("dishes").where({ id }).delete();

        return response.json({message: "Prato deletado com sucesso"});
    };

    async index(request, response){
        const { categories, ingredients } = request.params;

        
    };

};


module.exports = DishesController;