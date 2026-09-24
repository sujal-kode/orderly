import Cart from '#models/cart'
import Order from '#models/order'
import OrderItem from '#models/order_item'
import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'
import OrderTransformer from '#transformers/order_transformer'
import InventoryService from '#services/inventory_service'
import DiscountService from '#services/discount_service'
import { updateOrderStatusValidator, placeOrderValidator, returnOrderItemValidator } from '#validators/order'

export default class OrdersController {
  async index({ auth, request, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const search = request.input('search', '').trim()

    const query = Order.query()
      .where('userId', user.id)
      .preload('items', (itemsQuery) => itemsQuery.preload('product').preload('store'))
      .orderBy('createdAt', 'desc')

    if (search) {
      const searchId = Number(search.replace(/\D/g, ''))
      query.where((q) => {
        if (!Number.isNaN(searchId) && searchId > 0) {
          q.orWhere('id', searchId)
        }
        q.orWhereHas('items', (itemsQuery) =>
          itemsQuery.whereHas('product', (productQuery) => productQuery.whereILike('name', `%${search}%`))
        )
      })
    }

    const orders = await query.paginate(page, perPage)

    return serialize(OrderTransformer.paginate(orders.all(), orders.getMeta()))
  }

  async show({ auth, params, response, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const order = await Order.query()
      .where('id', params.id)
      .where('userId', user.id)
      .preload('items', (query) => query.preload('product').preload('store'))
      .first()

    if (!order) {
      return response.notFound({ message: 'Order not found' })
    }

    return serialize(OrderTransformer.transform(order))
  }

  async store({ auth, request, response, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await request.validateUsing(placeOrderValidator)

    const cart = await Cart.query().where('userId', user.id).preload('items', (query) => query.preload('product')).first()

    if (!cart || cart.items.length === 0) {
      return response.unprocessableEntity({ message: 'Cart is empty' })
    }

    const discountItems = cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.product.price,
    }))

    const discount = await DiscountService.calculate(discountItems)

    const customerLocation =
      data.latitude != null && data.longitude != null
        ? { latitude: data.latitude, longitude: data.longitude }
        : null

    const order = await db.transaction(async (trx) => {
      const allocations = await InventoryService.allocate(
        cart.items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        trx,
        customerLocation
      )

      const newOrder = new Order()
      newOrder.useTransaction(trx)
      newOrder.userId = user.id
      newOrder.subtotal = discount.subtotal
      newOrder.productDiscountAmount = discount.productDiscountAmount
      newOrder.platformDiscountAmount = discount.platformDiscountAmount
      newOrder.total = discount.total
      newOrder.deliveryAddress = data.deliveryAddress
      newOrder.customerLatitude = data.latitude ?? null
      newOrder.customerLongitude = data.longitude ?? null
      newOrder.discountType = discount.discountType
      newOrder.status = 'placed'
      await newOrder.save()

      for (const item of cart.items) {
        const stores = allocations.get(item.productId) ?? []
        for (const allocation of stores) {
          const orderItem = new OrderItem()
          orderItem.useTransaction(trx)
          orderItem.orderId = newOrder.id
          orderItem.productId = item.productId
          orderItem.storeId = allocation.storeId
          orderItem.quantity = allocation.quantity
          orderItem.unitPrice = item.product.price
          orderItem.totalPrice = item.product.price * allocation.quantity
          await orderItem.save()
        }
      }

      await InventoryService.deduct(allocations, trx)

      cart.useTransaction(trx)
      for (const item of cart.items) {
        item.useTransaction(trx)
        await item.delete()
      }

      return newOrder
    })

    await order.load('items', (query) => query.preload('product').preload('store'))

    return response.created(await serialize(OrderTransformer.transform(order)))
  }

  async adminIndex({ request, serialize }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const search = request.input('search', '').trim()

    const query = Order.query()
      .preload('items', (itemsQuery) => itemsQuery.preload('product').preload('store'))
      .preload('user')
      .orderBy('createdAt', 'desc')

    if (search) {
      const searchId = Number(search.replace(/\D/g, ''))
      query.where((q) => {
        if (!Number.isNaN(searchId) && searchId > 0) {
          q.orWhere('id', searchId)
        }
        q.orWhereHas('user', (userQuery) =>
          userQuery.whereILike('fullName', `%${search}%`).orWhereILike('email', `%${search}%`)
        )
      })
    }

    const orders = await query.paginate(page, perPage)

    return serialize(OrderTransformer.paginate(orders.all(), orders.getMeta()))
  }

  async adminShow({ params, response, serialize }: HttpContext) {
    const order = await Order.query()
      .where('id', params.id)
      .preload('items', (query) => query.preload('product').preload('store'))
      .preload('user')
      .first()

    if (!order) {
      return response.notFound({ message: 'Order not found' })
    }

    return serialize(OrderTransformer.transform(order))
  }

  async updateStatus({ params, request, response, serialize }: HttpContext) {
    const order = await Order.findOrFail(params.id)
    const data = await request.validateUsing(updateOrderStatusValidator)

    if (data.status === 'cancelled' && order.status !== 'cancelled') {
      if (order.status === 'returned') {
        return response.unprocessableEntity({
          message: 'Cannot cancel an order that has already been returned.',
        })
      }

      await order.load('items')

      await db.transaction(async (trx) => {
        order.useTransaction(trx)
        for (const item of order.items) {
          const returnable = item.quantity - item.returnedQuantity
          if (returnable <= 0) continue
          await InventoryService.restore(item.productId, item.storeId, returnable, trx)
          item.useTransaction(trx)
          item.returnedQuantity = item.quantity
          await item.save()
        }
        order.status = data.status
        await order.save()
      })

      await order.load('items', (query) => query.preload('product').preload('store'))
      return serialize(OrderTransformer.transform(order))
    }

    order.status = data.status
    await order.save()
    return serialize(OrderTransformer.transform(order))
  }

  async returnItem({ auth, params, request, response, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await request.validateUsing(returnOrderItemValidator)

    const order = await Order.query().where('id', params.id).where('userId', user.id).first()

    if (!order) {
      return response.notFound({ message: 'Order not found' })
    }

    if (order.status === 'cancelled') {
      return response.unprocessableEntity({ message: 'Cannot return items on a cancelled order.' })
    }

    const orderItem = await OrderItem.query()
      .where('id', params.itemId)
      .where('orderId', order.id)
      .first()

    if (!orderItem) {
      return response.notFound({ message: 'Order item not found' })
    }

    const remaining = orderItem.quantity - orderItem.returnedQuantity
    if (data.quantity > remaining) {
      return response.unprocessableEntity({
        message: `Cannot return ${data.quantity} units — only ${remaining} unit(s) available to return on this item.`,
      })
    }

    const updatedOrder = await db.transaction(async (trx) => {
      await InventoryService.restore(orderItem.productId, orderItem.storeId, data.quantity, trx)

      orderItem.useTransaction(trx)
      orderItem.returnedQuantity += data.quantity
      await orderItem.save()

      order.useTransaction(trx)
      await order.load('items', (query) => query.preload('product'))

      const remainingByProduct = new Map<number, { quantity: number; unitPrice: number }>()
      for (const item of order.items) {
        const qty = item.quantity - item.returnedQuantity
        if (qty <= 0) continue
        const existing = remainingByProduct.get(item.productId)
        if (existing) {
          existing.quantity += qty
        } else {
          remainingByProduct.set(item.productId, { quantity: qty, unitPrice: item.unitPrice })
        }
      }

      const discountItems = Array.from(remainingByProduct.entries()).map(([productId, v]) => ({
        productId,
        quantity: v.quantity,
        unitPrice: v.unitPrice,
      }))

      const discount = await DiscountService.calculate(discountItems)

      order.subtotal = discount.subtotal
      order.productDiscountAmount = discount.productDiscountAmount
      order.platformDiscountAmount = discount.platformDiscountAmount
      order.total = discount.total
      order.discountType = discount.discountType

      const allReturned = order.items.every((item) => item.returnedQuantity >= item.quantity)
      if (allReturned) {
        order.status = 'returned'
      }

      await order.save()

      return order
    })

    await updatedOrder.load('items', (query) => query.preload('product').preload('store'))

    return serialize(OrderTransformer.transform(updatedOrder))
  }
}
