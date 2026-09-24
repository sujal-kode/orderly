import vine from '@vinejs/vine'

export const updateOrderStatusValidator = vine.create({
  status: vine.enum(['placed', 'processing', 'completed', 'cancelled', 'returned'] as const),
})

export const placeOrderValidator = vine.create({
  deliveryAddress: vine.string().trim().minLength(5).maxLength(500),
  latitude: vine.number().range([-90, 90]).optional(),
  longitude: vine.number().range([-180, 180]).optional(),
})

export const returnOrderItemValidator = vine.create({
  quantity: vine.number().positive(),
})
