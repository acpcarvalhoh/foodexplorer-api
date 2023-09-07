exports.up = function(knex) {
    return knex.schema.createTable('ingredients', function(table){
        table.increments('id').primary(); 
        table.integer('dish_id').unsigned(); 
        table.string('name').notNullable();
        
        
        table.foreign('dish_id').references('id').inTable('dishes').onDelete('CASCADE');
    });
};
 
exports.down = function(knex) {
    return knex.schema.dropTable('ingredients');
};
 
 
