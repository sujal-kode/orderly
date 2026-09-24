import vine from '@vinejs/vine'

export const createStoreValidator = vine.create({
  name: vine.string().trim().minLength(1).maxLength(255),
  address: vine.string().trim().minLength(1).maxLength(255),
  latitude: vine.number().range([-90, 90]).nullable().optional(),
  longitude: vine.number().range([-180, 180]).nullable().optional(),
  isActive: vine.boolean().optional(),
})

export const updateStoreValidator = vine.create({
  name: vine.string().trim().minLength(1).maxLength(255).optional(),
  address: vine.string().trim().minLength(1).maxLength(255).optional(),
  latitude: vine.number().range([-90, 90]).nullable().optional(),
  longitude: vine.number().range([-180, 180]).nullable().optional(),
  isActive: vine.boolean().optional(),
})
