import { Exception } from '@adonisjs/core/exceptions'

export default class InsufficientInventoryException extends Exception {
  static status = 422
  static code = 'E_INSUFFICIENT_INVENTORY'

  constructor(
    message: string,
    public productId: number
  ) {
    super(message, { status: 422, code: 'E_INSUFFICIENT_INVENTORY' })
  }
}
