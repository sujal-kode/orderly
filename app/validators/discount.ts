import vine from '@vinejs/vine'

export const createProductDiscountValidator = vine.create({
  productId: vine.number().positive(),
  minQuantity: vine.number().min(1),
  discountPercentage: vine.number().range([0, 100]),
  isActive: vine.boolean().optional(),
})

export const updateProductDiscountValidator = vine.create({
  minQuantity: vine.number().min(1).optional(),
  discountPercentage: vine.number().range([0, 100]).optional(),
  isActive: vine.boolean().optional(),
})

export const createPlatformDiscountValidator = vine.create({
  name: vine.string().trim().minLength(1).maxLength(255),
  minOrderAmount: vine.number().min(0),
  discountPercentage: vine.number().range([0, 100]),
  isActive: vine.boolean().optional(),
})

export const updatePlatformDiscountValidator = vine.create({
  name: vine.string().trim().minLength(1).maxLength(255).optional(),
  minOrderAmount: vine.number().min(0).optional(),
  discountPercentage: vine.number().range([0, 100]).optional(),
  isActive: vine.boolean().optional(),
})
