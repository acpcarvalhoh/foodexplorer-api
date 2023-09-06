exports.up = function(knex) {
   return knex.schema.createTable('userRoles', function(table){
        table.increments('id').primary(); 
        table.string('name').notNullable();
        table.string('email').notNullable().unique();
        table.string('password').notNullable();
        table.string('avatar', 255); 
        table.enu('role', ['user', 'admin']).notNullable();

        table.timestamps(true, true);


    }); 
};


exports.down = function(knex) {
    return knex.schema.dropTable('userRoles');
};
