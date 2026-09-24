import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import OrderItem from '#models/order_item'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare subtotal: number

  @column()
  declare productDiscountAmount: number

  @column()
  declare platformDiscountAmount: number

  @column()
  declare total: number

  @column()
  declare deliveryAddress: string

  @column()
  declare customerLatitude: number | null

  @column()
  declare customerLongitude: number | null

  @column()
  declare discountType: 'product' | 'platform' | null

  @column()
  declare status: 'placed' | 'processing' | 'completed' | 'cancelled' | 'returned'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => OrderItem)
  declare items: HasMany<typeof OrderItem>
}
