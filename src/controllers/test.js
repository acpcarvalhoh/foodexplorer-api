
    const { search } = request.query;
  
    // Primeiro, vamos buscar os pratos que correspondem ao termo de pesquisa no nome do prato.
    const dishes = await knex("dishes")
      .select([
        "dishes.id",
        "dishes.name",
        "dishes.description",
        "dishes.price"
      ])
      .where("dishes.name", "like", `%${search}%`)
      .orderBy("dishes.name");
  
    // Agora, vamos buscar os ingredientes que correspondem ao termo de pesquisa.
    const ingredients = await knex("ingredients")
      .select("ingredients.dish_id")
      .where("ingredients.name", "like", `%${search}%`);
  
    // Em seguida, vamos criar um array com os IDs dos pratos que têm os ingredientes correspondentes.
    const dishIdsWithIngredients = ingredients.map(ingredient => ingredient.dish_id);
  
    // Agora, vamos filtrar os pratos que têm os IDs correspondentes aos ingredientes.
    const filteredDishes = dishes.filter(dish => dishIdsWithIngredients.includes(dish.id));
  
    // Vamos buscar as categorias e ingredientes relacionados a cada prato.
    const dishIngredients = await knex("ingredients");
    const dishCategories = await knex("categories");
  
    const dishWithIngredients = filteredDishes.map(dish => {
      const dishIngredient = dishIngredients.filter(ingredient => ingredient.dish_id === dish.id);
      const dishCategory = dishCategories
        .filter(category => category.dish_id === dish.id)
        .map(category => category.name)
        .join(", ");
  
      return {
        ...dish,
        ingredients: dishIngredient,
        category: dishCategory
      };
    });
  
  