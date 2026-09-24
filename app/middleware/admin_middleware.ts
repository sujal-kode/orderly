import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Admin middleware restricts access to users with the "admin" role.
 * Must run after the auth middleware.
 */
export default class AdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.getUserOrFail()

    if (user.role !== 'admin') {
      return ctx.response.forbidden({ message: 'Admins only' })
    }

    return next()
  }
}
