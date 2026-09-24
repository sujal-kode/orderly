import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.decimal('customer_latitude', 10, 7).nullable()
      table.decimal('customer_longitude', 10, 7).nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('customer_latitude')
      table.dropColumn('customer_longitude')
    })
  }
}