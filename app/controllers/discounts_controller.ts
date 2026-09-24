import Product from '#models/product'
import ProductDiscount from '#models/product_discount'
import PlatformDiscount from '#models/platform_discount'
import type { HttpContext } from '@adonisjs/core/http'
import {
  createProductDiscountValidator,
  updateProductDiscountValidator,
  createPlatformDiscountValidator,
  updatePlatformDiscountValidator,
} from '#validators/discount'

export default class DiscountsController {
  async indexProduct({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const search = request.input('search', '').trim()

    const query = ProductDiscount.query().preload('product').orderBy('id', 'desc')
    if (search) {
      query.whereHas('product', (productQuery) => productQuery.whereILike('name', `%${search}%`))
    }

    const discounts = await query.paginate(page, perPage)

    return response.json({
      data: discounts.all().map((discount) => ({
        id: discount.id,
        productId: discount.productId,
        minQuantity: discount.minQuantity,
        discountPercentage: discount.discountPercentage,
        isActive: discount.isActive,
        product: { id: discount.product.id, name: discount.product.name },
      })),
      metadata: discounts.getMeta(),
    })
  }

  async storeProduct({ request, response, serialize }: HttpContext) {
    const data = await request.validateUsing(createProductDiscountValidator)
    await Product.findOrFail(data.productId)
    const discount = await ProductDiscount.create(data)
    return response.created(await serialize(discount))
  }

  async updateProduct({ params, request, serialize }: HttpContext) {
    const discount = await ProductDiscount.findOrFail(params.id)
    const data = await request.validateUsing(updateProductDiscountValidator)
    discount.merge(data)
    await discount.save()
    return serialize(discount)
  }

  async destroyProduct({ params, response }: HttpContext) {
    const discount = await ProductDiscount.findOrFail(params.id)
    await discount.delete()
    return response.noContent()
  }

  async indexPlatform({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const search = request.input('search', '').trim()

    const query = PlatformDiscount.query().orderBy('id', 'desc')
    if (search) {
      query.whereILike('name', `%${search}%`)
    }

    const discounts = await query.paginate(page, perPage)

    return response.json({
      data: discounts.all().map((discount) => discount.serialize()),
      metadata: discounts.getMeta(),
    })
  }

  async storePlatform({ request, response, serialize }: HttpContext) {
    const data = await request.validateUsing(createPlatformDiscountValidator)
    const discount = await PlatformDiscount.create(data)
    return response.created(await serialize(discount))
  }

  async updatePlatform({ params, request, serialize }: HttpContext) {
    const discount = await PlatformDiscount.findOrFail(params.id)
    const data = await request.validateUsing(updatePlatformDiscountValidator)
    discount.merge(data)
    await discount.save()
    return serialize(discount)
  }

  async destroyPlatform({ params, response }: HttpContext) {
    const discount = await PlatformDiscount.findOrFail(params.id)
    await discount.delete()
    return response.noContent()
  }
}
