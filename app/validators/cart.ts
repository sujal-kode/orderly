import vine from '@vinejs/vine'

export const addToCartValidator = vine.create({
  productId: vine.number().positive(),
  quantity: vine.number().min(1),
})

export const updateCartItemValidator = vine.create({
  quantity: vine.number().min(0),
})
