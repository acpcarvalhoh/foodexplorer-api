const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class FavoritesDishesController{
    async create(request, response){
        const { dish_id } = request.body;
        const user_id = request.user.id;

        if(!dish_id || !user_id){
          throw new AppError("Erro ao favoritar", 400)

        };

        await knex("favorites").insert({
            dish_id,
            user_id
        });

        return response.json({ message: "Prato adicionado aos favoritos" });
    };

    async index(request, response){
        const user_id = request.user.id;

        const favoritesDishes = await knex("favorites").where({ user_id });
        const favoriteDishIds = favoritesDishes.map(favorite => favorite.dish_id)

        const dishesFavorites = await knex("dishes")
        .whereIn("id", favoriteDishIds)
        .select([
            "id",
            "name",
            "image",
        ])
        .orderBy("name");
        
        return response.json(dishesFavorites);
    };

    async delete(request, response){
        const { id } = request.params;

        await knex("favorites").where({ dish_id: id }).delete();

        return response.json({ message: "Prato removido dos favoritos!" });
    };

    
};


module.exports = FavoritesDishesController;