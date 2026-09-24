import Store from '#models/store'
import type { HttpContext } from '@adonisjs/core/http'
import StoreTransformer from '#transformers/store_transformer'
import { createStoreValidator, updateStoreValidator } from '#validators/store'

export default class StoresController {
  async index({ request, serialize }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const search = request.input('search', '').trim()

    const query = Store.query().orderBy('name', 'asc')
    if (search) {
      query.where((q) => {
        q.whereILike('name', `%${search}%`).orWhereILike('address', `%${search}%`)
      })
    }

    const stores = await query.paginate(page, perPage)
    return serialize(StoreTransformer.paginate(stores.all(), stores.getMeta()))
  }

  async show({ params, serialize }: HttpContext) {
    const store = await Store.findOrFail(params.id)
    return serialize(StoreTransformer.transform(store))
  }

  async store({ request, response, serialize }: HttpContext) {
    const data = await request.validateUsing(createStoreValidator)
    const store = await Store.create(data)
    return response.created(await serialize(StoreTransformer.transform(store)))
  }

  async update({ params, request, serialize }: HttpContext) {
    const store = await Store.findOrFail(params.id)
    const data = await request.validateUsing(updateStoreValidator)
    store.merge(data)
    await store.save()
    return serialize(StoreTransformer.transform(store))
  }

  async destroy({ params, response }: HttpContext) {
    const store = await Store.findOrFail(params.id)
    await store.delete()
    return response.noContent()
  }
}
