import Store from '#models/store'
import Product from '#models/product'
import StoreInventory from '#models/store_inventory'
import type { HttpContext } from '@adonisjs/core/http'
import { setInventoryValidator, updateInventoryValidator } from '#validators/inventory'

export default class InventoryController {
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const search = request.input('search', '').trim()

    const query = StoreInventory.query().preload('store').preload('product')
    if (search) {
      query.where((q) => {
        q.whereHas('product', (productQuery) => productQuery.whereILike('name', `%${search}%`)).orWhereHas(
          'store',
          (storeQuery) => storeQuery.whereILike('name', `%${search}%`)
        )
      })
    }

    const inventories = await query.paginate(page, perPage)

    return response.json({
      data: inventories.all().map((inventory) => ({
        id: inventory.id,
        storeId: inventory.storeId,
        productId: inventory.productId,
        quantity: inventory.quantity,
        store: { id: inventory.store.id, name: inventory.store.name },
        product: { id: inventory.product.id, name: inventory.product.name },
      })),
      metadata: inventories.getMeta(),
    })
  }

  async store({ request, response, serialize }: HttpContext) {
    const data = await request.validateUsing(setInventoryValidator)

    await Store.findOrFail(data.storeId)
    await Product.findOrFail(data.productId)

    const inventory = await StoreInventory.updateOrCreate(
      { storeId: data.storeId, productId: data.productId },
      { quantity: data.quantity }
    )

    return response.created(await serialize(inventory))
  }

  async update({ params, request, serialize }: HttpContext) {
    const inventory = await StoreInventory.findOrFail(params.id)
    const data = await request.validateUsing(updateInventoryValidator)
    inventory.quantity = data.quantity
    await inventory.save()
    return serialize(inventory)
  }
}
