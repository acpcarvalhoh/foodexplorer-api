exports.up = function (knex) {
    return knex.schema.createTable('favorites', table => {
      table.increments('id').primary(); 
      table.integer('user_id').unsigned().notNullable();
      table.integer('dish_id').unsigned().notNullable();

      table.foreign('dish_id').references('id').inTable('dishes').onDelete('CASCADE');
      table.foreign('user_id').references('id').inTable('userRoles').onDelete('CASCADE');

    });
};
  
exports.down = function(knex) {
    return knex.schema.dropTable('favorites');
};

  