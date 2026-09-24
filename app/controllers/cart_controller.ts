import Cart from '#models/cart'
import Product from '#models/product'
import CartItem from '#models/cart_item'
import type { HttpContext } from '@adonisjs/core/http'
import DiscountService from '#services/discount_service'
import { addToCartValidator, updateCartItemValidator } from '#validators/cart'

export default class CartController {
  async show({ auth, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const cart = await this.getOrCreateCart(user.id)
    await cart.load('items', (query) => query.preload('product'))

    return serialize(await this.serializeCart(cart))
  }

  async store({ auth, request, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await request.validateUsing(addToCartValidator)

    await Product.findOrFail(data.productId)

    const cart = await this.getOrCreateCart(user.id)

    const existing = await CartItem.query()
      .where('cartId', cart.id)
      .where('productId', data.productId)
      .first()

    if (existing) {
      existing.quantity += data.quantity
      await existing.save()
    } else {
      await CartItem.create({
        cartId: cart.id,
        productId: data.productId,
        quantity: data.quantity,
      })
    }

    await cart.load('items', (query) => query.preload('product'))
    return serialize(await this.serializeCart(cart))
  }

  async update({ auth, params, request, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const cart = await this.getOrCreateCart(user.id)
    const data = await request.validateUsing(updateCartItemValidator)

    const item = await CartItem.query()
      .where('id', params.id)
      .where('cartId', cart.id)
      .firstOrFail()

    if (data.quantity === 0) {
      await item.delete()
    } else {
      item.quantity = data.quantity
      await item.save()
    }

    await cart.load('items', (query) => query.preload('product'))
    return serialize(await this.serializeCart(cart))
  }

  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const cart = await this.getOrCreateCart(user.id)

    const item = await CartItem.query()
      .where('id', params.id)
      .where('cartId', cart.id)
      .firstOrFail()

    await item.delete()
    return response.noContent()
  }

  async clear({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const cart = await this.getOrCreateCart(user.id)
    await CartItem.query().where('cartId', cart.id).delete()
    return response.noContent()
  }

  private async getOrCreateCart(userId: number) {
    const [cart] = await Cart.fetchOrCreateMany(['userId'], [{ userId }])
    return cart
  }

  private async serializeCart(cart: Cart) {
    const items = cart.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        imageUrl: item.product.imageUrl,
      },
    }))

    const discountItems = items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.product.price,
    }))

    const discount = await DiscountService.calculate(discountItems)

    return {
      id: cart.id,
      items,
      ...discount,
    }
  }
}
