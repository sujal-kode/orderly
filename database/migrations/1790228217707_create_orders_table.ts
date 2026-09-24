import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.decimal('subtotal', 10, 2).notNullable()
      table.decimal('product_discount_amount', 10, 2).notNullable().defaultTo(0)
      table.decimal('platform_discount_amount', 10, 2).notNullable().defaultTo(0)
      table.decimal('total', 10, 2).notNullable()
      table.string('discount_type').nullable()
      table.string('status').notNullable().defaultTo('placed')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
