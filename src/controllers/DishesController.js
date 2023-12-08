const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const updateCategoriesAndIngredients = require("../utils/dbUtils");
const Diskstorage = require("../providers/Diskstorage");


class DishesController{
    async create(request, response){
        const admin_id = request.user.id;
        const { name, description, ingredients, categories, price } = request.body;
        const fileName = request.file.filename;

        const ingredientsArray = ingredients.split(',');

        const diskstorage = new Diskstorage();
        const dishImage = await diskstorage.save(fileName);
        
        const checkDishExist = await knex("dishes").where({ name }).first();
        if(checkDishExist){
            throw new AppError("Você já cadastrou um prato com esse nome", 409);
        };

        const [dish_id] = await knex("dishes").insert({
            name,
            image: dishImage,
            description, 
            price, 
            admin_id
        });

        
        const ingredientsInsert = ingredientsArray.map(name => {
            return {
                dish_id,
                name,
            };
        });

        await knex("ingredients").insert(ingredientsInsert);

        await knex("categories").insert({ dish_id, name: categories });
        
        response.status(200).json({ message: "Prato cadastrado com sucesso" })

    };


    async update(request, response){
        const { name, description, ingredients, categories, price } = request.body;
        const { dish_id } = request.params;
        let fileName;

        if(request.file){
            fileName = request.file.filename;
        };
      
        const categoriesArray = categories.split(',');
        const ingredientsArray = ingredients.split(',');
    
        const diskstorage = new Diskstorage();
        const dish = await knex("dishes").where({ id: dish_id }).first();
       
        if(!dish){
            throw new AppError("Prato não encontrado!!", 404);    
        };

        if(fileName !== undefined && dish.image){
            await diskstorage.delete(dish.image);

        };  
   
        if (name !== dish.name) {
            const dishWithUpdatedName = await knex("dishes").where({ name }).first();
            
            if (dishWithUpdatedName) {
                throw new AppError("Já existe um prato com este nome!", 409);
            };
        };

        
        const uniqueCategory = [...new Set(categoriesArray)]
        if(uniqueCategory.length !== categoriesArray.length){
            throw new AppError("Não é permitido ter categoria duplicada no mesmo prato!", 400);
        };

        const uniqueIngredient = [...new Set(ingredientsArray)]
        if(uniqueIngredient.length !== ingredientsArray.length){
            throw new AppError("Não é permitido ter ingrediente com nome duplicado no mesmo prato!", 400);
        };

        if(fileName !== undefined){
            const dishImage =  await diskstorage.save(fileName);
            dish.image = dishImage;
        }; 
             
        dish.name = name ?? dish.name;
        dish.description = description ?? dish.description;
        dish.price = price ?? dish.price;
       
        await knex("dishes").update(dish).where({id: dish_id});
        await updateCategoriesAndIngredients("ingredients", ingredientsArray, dish_id);
        await updateCategoriesAndIngredients("categories", categoriesArray, dish_id);
            
        return response.status(200).json({ message: "Prato atualizado" });

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

        const diskstorage = new Diskstorage();
        const dish = await knex("dishes").where({ id }).first();

        await diskstorage.delete(dish.image);
        await knex("dishes").where({ id }).delete();

        return response.json({message: "Prato deletado com sucesso"});
    };

    async index(request, response){
        const { search } = request.query;

        const dishesByName = await knex("dishes")
        .select([
            "dishes.id",
            "dishes.name",
            "dishes.image",
            "dishes.description",
            "dishes.price"
        ])
        .where("dishes.name", "like", `%${search}%`)
        .orderBy("dishes.name");

        const ingredients = await knex("ingredients")
        .select("ingredients.dish_id")
        .where("ingredients.name", "like", `%${search}%`);

        const  ingredientsId = ingredients.map(ingredient => ingredient.dish_id);

        const dishesByIngredients = await knex("dishes")
        .select([
            "dishes.id",
            "dishes.name",
            "dishes.image",
            "dishes.description",
            "dishes.price"
        ])
        .whereIn("dishes.id", ingredientsId)
        .orderBy("dishes.name");

        const uniqueDishIds = new Set([...dishesByName.map((dish) => dish.id), ...dishesByIngredients.map((dish) => dish.id)]);
        
        const combinedDishes = await knex("dishes")
        .select([
            "dishes.id",
            "dishes.name",
            "dishes.image",
            "dishes.description",
            "dishes.price",
        ])
        .whereIn("dishes.id", Array.from(uniqueDishIds))
        .orderBy("dishes.name");

               
        const dishIngredients = await knex("ingredients");
        const dishCategories = await knex("categories");
        const dishWithIngredients = combinedDishes.map(dish => {
            const dishIngredient = dishIngredients.filter(ingredient => ingredient.dish_id === dish.id);
            const dishCategory = dishCategories.filter(category => category.dish_id === dish.id)
            .map(name => name.name).join(", ");
            
            return{
                ...dish,
                ingredients: dishIngredient,
                category: dishCategory
            };
        }); 

        return response.json(dishWithIngredients);
        
    };

};


module.exports = DishesController;