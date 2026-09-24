import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'
import ProductTransformer from '#transformers/product_transformer'
import { createProductValidator, updateProductValidator } from '#validators/product'

const SORTABLE_COLUMNS = ['name', 'price'] as const
type SortableColumn = (typeof SORTABLE_COLUMNS)[number]

function resolveSort(request: HttpContext['request']): { column: SortableColumn; direction: 'asc' | 'desc' } {
  const sortBy = request.input('sortBy', 'name')
  const sortDir = request.input('sortDir', 'asc')
  const column = SORTABLE_COLUMNS.includes(sortBy) ? (sortBy as SortableColumn) : 'name'
  const direction = sortDir === 'desc' ? 'desc' : 'asc'
  return { column, direction }
}

export default class ProductsController {
  async index({ request, serialize }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 12)
    const search = request.input('search', '').trim()
    const { column, direction } = resolveSort(request)

    const query = Product.query().orderBy(column, direction)
    if (search) {
      query.where((q) => {
        q.whereILike('name', `%${search}%`).orWhereILike('description', `%${search}%`)
      })
    }

    const products = await query.paginate(page, perPage)
    return serialize(ProductTransformer.paginate(products.all(), products.getMeta()))
  }

  async show({ params, serialize }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    return serialize(ProductTransformer.transform(product))
  }

  async store({ request, response, serialize }: HttpContext) {
    const data = await request.validateUsing(createProductValidator)
    const product = await Product.create(data)
    return response.created(await serialize(ProductTransformer.transform(product)))
  }

  async update({ params, request, serialize }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    const data = await request.validateUsing(updateProductValidator)
    product.merge(data)
    await product.save()
    return serialize(ProductTransformer.transform(product))
  }

  async destroy({ params, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    await product.delete()
    return response.noContent()
  }

  async customerIndex({ request, serialize }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 12)
    const search = request.input('search', '').trim()
    const { column, direction } = resolveSort(request)

    const query = Product.query().where('isActive', true).orderBy(column, direction)
    if (search) {
      query.where((q) => {
        q.whereILike('name', `%${search}%`).orWhereILike('description', `%${search}%`)
      })
    }

    const products = await query.paginate(page, perPage)
    return serialize(ProductTransformer.paginate(products.all(), products.getMeta()))
  }

  async customerShow({ params, response, serialize }: HttpContext) {
    const product = await Product.query()
      .where('id', params.id)
      .where('isActive', true)
      .first()

    if (!product) {
      return response.notFound({ message: 'Product not found' })
    }

    return serialize(ProductTransformer.transform(product))
  }
}
