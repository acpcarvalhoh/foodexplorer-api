const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const updateCategoriesAndIngredients = require("../utils/dbUtils");
const Diskstorage = require("../providers/Diskstorage");


class DishesController{
    async create(request, response){
        const admin_id = 1;
        const { name, description, ingredients, categories, price } = request.body;
        const fileName = request.file.filename;
     
        const categoriesArray = JSON.parse(categories);
        const ingredientsArray = JSON.parse(ingredients);
    
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

        const categoriesInsert = categoriesArray.map(name => {
            return {
                dish_id,
                name,
            };
        });

        await knex("categories").insert(categoriesInsert);
        
        response.status(200).json({ message: "Prato cadastrado com sucesso" })

    };


    async update(request, response){
        const { name, description, ingredients, categories, price } = request.body;
        const { dish_id } = request.params;
        const fileName = request.file.filename;

        const categoriesArray = JSON.parse(categories);
        const ingredientsArray = JSON.parse(ingredients);
    
        const diskstorage = new Diskstorage();
        const dish = await knex("dishes").where({ id: dish_id }).first();
       
        if(!dish){
            throw new AppError("Prato não encontrado!!", 404);    
        };

        if(dish.image){
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
       
        const dishImage =  await diskstorage.save(fileName);

        dish.name = name ?? dish.name;
        dish.description = description ?? dish.description;
        dish.image = dishImage;
        dish.price = price ?? dish.price;

                 
        await knex("dishes").update(dish).where({id: dish_id});

        await updateCategoriesAndIngredients("ingredients", ingredientsArray, dish_id);
        await updateCategoriesAndIngredients("categories", categoriesArray, dish_id);
            
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

        const diskstorage = new Diskstorage();
        const dish = await knex("dishes").where({ id }).first();

        await diskstorage.delete(dish.image);
        await knex("dishes").where({ id }).delete();

        return response.json({message: "Prato deletado com sucesso"});
    };

    async index(request, response){
        const { name, ingredients, categories } = request.query;

        let dishes;

        if(ingredients || categories){
            const filterIngredients = ingredients.split(',').map(ingredient => ingredient.trim());

            const filterCategories = categories.split(',').map(category => category.trim());

            dishes = await knex("ingredients")
            .select([
                "dishes.id",
                "dishes.name",
                "dishes.description",
                "dishes.price"
                               
            ])
            .whereLike("dishes.name", `%${name}%`)
            .whereIn("ingredients.name", filterIngredients)
            .innerJoin("dishes", "dishes.id", "ingredients.dish_id")
            .orderBy("dishes.name");

            dishes = await knex("categories")
            .select([
                "dishes.id",
                "dishes.name",
                "dishes.description",
                "dishes.price"
                               
            ])
            .whereLike("dishes.name", `%${name}%`)
            .whereIn("categories.name", filterCategories)
            .innerJoin("dishes", "dishes.id", "categories.dish_id")
            .orderBy("dishes.name");
            

        }else{
            dishes = await knex("dishes")
            .whereLike("name", `%${name}%`)
            .orderBy("name");
        };

        const dishIngredients = await knex("ingredients");
        const dishCategories = await knex("categories");
        const dishWithIngredientsAndCategories = dishes.map(dish => {
            const dishIngredient = dishIngredients.filter(ingredient => ingredient.dish_id === dish.id);

            const dishCategory = dishCategories.filter(category => category.dish_id === dish.id);


            return{
                ...dish,
                ingredients: dishIngredient,
                categories: dishCategory
            };
        });

        return response.json(dishWithIngredientsAndCategories);
        
    };

};


module.exports = DishesController;