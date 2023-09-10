const knex = require("../database/knex");

async function updateCategoriesAndIngredients(table, names, dish_id) {

    const nameList = names[0].split(',').map((item) => item.trim());
  
    
    const existingItems = await knex(table).select("name").where({ dish_id });

    const existingNames = existingItems.map((item) => item.name);
  
    const itemsToDelete = existingNames.filter((name) => !nameList.includes(name));
  
   
    for (const nameToDelete of itemsToDelete) {
      await knex(table).where({ name: nameToDelete, dish_id }).del();
    };
  
    
    for (const name of nameList) {
      const existingItem = await knex(table).where({ name, dish_id }).first();

      if (!existingItem) {
        await knex(table).insert({ name, dish_id });
      };

    };

};


module.exports = updateCategoriesAndIngredients;
  
 
  