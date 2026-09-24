import ProductDiscount from '#models/product_discount'
import PlatformDiscount from '#models/platform_discount'

export interface DiscountCartItem {
  productId: number
  quantity: number
  unitPrice: number
}

export interface DiscountResult {
  discountType: 'product' | 'platform' | null
  productDiscountAmount: number
  platformDiscountAmount: number
  subtotal: number
  total: number
}

/**
 * Calculates product-level and platform-level discounts for a set of cart
 * items and applies whichever discount gives the larger amount off. The two
 * discount types are mutually exclusive — never combined.
 */
export default class DiscountService {
  static async calculate(items: DiscountCartItem[]): Promise<DiscountResult> {
    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

    const productDiscountAmount = await this.calculateProductDiscount(items)
    const platformDiscountAmount = await this.calculatePlatformDiscount(subtotal)

    let discountType: 'product' | 'platform' | null = null
    let appliedAmount = 0

    if (productDiscountAmount > 0 || platformDiscountAmount > 0) {
      if (productDiscountAmount >= platformDiscountAmount) {
        discountType = 'product'
        appliedAmount = productDiscountAmount
      } else {
        discountType = 'platform'
        appliedAmount = platformDiscountAmount
      }
    }

    return {
      discountType,
      productDiscountAmount: discountType === 'product' ? appliedAmount : 0,
      platformDiscountAmount: discountType === 'platform' ? appliedAmount : 0,
      subtotal,
      total: subtotal - appliedAmount,
    }
  }

  private static async calculateProductDiscount(items: DiscountCartItem[]): Promise<number> {
    const productIds = items.map((item) => item.productId)
    if (productIds.length === 0) return 0

    const discounts = await ProductDiscount.query()
      .whereIn('productId', productIds)
      .where('isActive', true)

    let total = 0

    for (const item of items) {
      const eligible = discounts.filter(
        (discount) => discount.productId === item.productId && item.quantity >= discount.minQuantity
      )

      if (eligible.length === 0) continue

      const best = eligible.reduce((max, discount) =>
        discount.discountPercentage > max.discountPercentage ? discount : max
      )

      total += item.unitPrice * item.quantity * (best.discountPercentage / 100)
    }

    return total
  }

  private static async calculatePlatformDiscount(subtotal: number): Promise<number> {
    const discounts = await PlatformDiscount.query()
      .where('isActive', true)
      .where('minOrderAmount', '<=', subtotal)
      .orderBy('discountPercentage', 'desc')
      .first()

    if (!discounts) return 0

    return subtotal * (discounts.discountPercentage / 100)
  }
}
