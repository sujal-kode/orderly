import vine from '@vinejs/vine'

export const setInventoryValidator = vine.create({
  storeId: vine.number().positive(),
  productId: vine.number().positive(),
  quantity: vine.number().min(0),
})

export const updateInventoryValidator = vine.create({
  quantity: vine.number().min(0),
})
