import vine from '@vinejs/vine'

export const createProductValidator = vine.create({
  name: vine.string().trim().minLength(1).maxLength(255),
  description: vine.string().trim().nullable().optional(),
  price: vine.number().positive(),
  imageUrl: vine.string().trim().url().nullable().optional(),
  isActive: vine.boolean().optional(),
})

export const updateProductValidator = vine.create({
  name: vine.string().trim().minLength(1).maxLength(255).optional(),
  description: vine.string().trim().nullable().optional(),
  price: vine.number().positive().optional(),
  imageUrl: vine.string().trim().url().nullable().optional(),
  isActive: vine.boolean().optional(),
})
