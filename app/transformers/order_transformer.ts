import type Order from '#models/order'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class OrderTransformer extends BaseTransformer<Order> {
  toObject() {
    return {
      ...this.pick(this.resource, [
        'id',
        'userId',
        'subtotal',
        'productDiscountAmount',
        'platformDiscountAmount',
        'total',
        'deliveryAddress',
        'discountType',
        'status',
        'createdAt',
        'updatedAt',
      ]),
      items: this.resource.items?.map((item) => ({
        id: item.id,
        productId: item.productId,
        storeId: item.storeId,
        quantity: item.quantity,
        returnedQuantity: item.returnedQuantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        product: item.product
          ? { id: item.product.id, name: item.product.name, imageUrl: item.product.imageUrl }
          : undefined,
        store: item.store ? { id: item.store.id, name: item.store.name } : undefined,
      })),
      user: this.resource.user
        ? { id: this.resource.user.id, fullName: this.resource.user.fullName, email: this.resource.user.email }
        : undefined,
    }
  }
}
