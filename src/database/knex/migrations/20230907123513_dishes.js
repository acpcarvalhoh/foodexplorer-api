exports.up = function(knex) {
    return knex.schema.createTable('dishes', function(table){
        table.increments('id').primary(); 
        table.string('image').notNullable();
        table.string('name').notNullable();
        table.text('description');
        table.decimal('price', 10, 2).notNullable();
        table.integer('admin_id').unsigned();
        
        table.foreign('admin_id').references('id').inTable('userRoles');
        table.timestamps(true, true);

    });
};
 
exports.down = function(knex) {
    return knex.schema.dropTable('dishes');
};
 
