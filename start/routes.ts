/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import type { HttpContext } from '@adonisjs/core/http'
import edge from 'edge.js'
import app from '@adonisjs/core/services/app'
import { edgePluginVite } from '@adonisjs/vite/plugins/edge'
import vite from '@adonisjs/vite/services/main'
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

// Mount edge views and register vite plugin
edge.use(edgePluginVite(vite))
edge.mount(app.viewsPath())

const renderApp = async ({ response }: HttpContext) => {
  try {
    const html = await edge.render('root')
    return response.header('Content-Type', 'text/html; charset=utf-8').send(html)
  } catch {
    // Fallback if rendered directly
    const hmrScript = vite.getReactHmrScript() || ''
    const entryTags = (await vite.generateEntryPointsTags('resources/js/app.tsx')).join('\n')

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Orderly | Home</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  ${hmrScript}
  ${entryTags}
</head>
<body>
  <div id="root"></div>
</body>
</html>`
    return response.header('Content-Type', 'text/html; charset=utf-8').send(html)
  }
}

// Frontend Web Routes
router.get('/', renderApp)
router.get('/login', renderApp)
router.get('/signup', renderApp)
router.get('/dashboard', renderApp)
router.get('/admin', renderApp)
router.get('/admin/*', renderApp)
router.get('/app', renderApp)
router.get('/app/*', renderApp)

// API Routes
router
  .group(() => {
    // Auth
    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessTokens, 'store'])
      })
      .prefix('auth')
      .as('auth')

    // Account
    router
      .group(() => {
        router.get('profile', [controllers.Profile, 'show'])
        router.post('logout', [controllers.AccessTokens, 'destroy'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())

    // Admin
    router
      .group(() => {
        router.resource('stores', controllers.Stores).apiOnly()
        router.resource('products', controllers.Products).apiOnly()

        router.get('inventory', [controllers.Inventory, 'index'])
        router.post('inventory', [controllers.Inventory, 'store'])
        router.put('inventory/:id', [controllers.Inventory, 'update'])

        router.get('product-discounts', [controllers.Discounts, 'indexProduct'])
        router.post('product-discounts', [controllers.Discounts, 'storeProduct'])
        router.put('product-discounts/:id', [controllers.Discounts, 'updateProduct'])
        router.delete('product-discounts/:id', [controllers.Discounts, 'destroyProduct'])

        router.get('platform-discounts', [controllers.Discounts, 'indexPlatform'])
        router.post('platform-discounts', [controllers.Discounts, 'storePlatform'])
        router.put('platform-discounts/:id', [controllers.Discounts, 'updatePlatform'])
        router.delete('platform-discounts/:id', [controllers.Discounts, 'destroyPlatform'])

        router.get('orders', [controllers.Orders, 'adminIndex'])
        router.get('orders/:id', [controllers.Orders, 'adminShow'])
        router.put('orders/:id', [controllers.Orders, 'updateStatus'])
      })
      .prefix('admin')
      .as('admin')
      .use([middleware.auth(), middleware.admin()])

    // Customer
    router
      .group(() => {
        router.get('products', [controllers.Products, 'customerIndex'])
        router.get('products/:id', [controllers.Products, 'customerShow'])

        router.get('cart', [controllers.Cart, 'show'])
        router.post('cart', [controllers.Cart, 'store'])
        router.delete('cart', [controllers.Cart, 'clear'])
        router.put('cart/items/:id', [controllers.Cart, 'update'])
        router.delete('cart/items/:id', [controllers.Cart, 'destroy'])

        router.get('orders', [controllers.Orders, 'index'])
        router.post('orders', [controllers.Orders, 'store'])
        router.get('orders/:id', [controllers.Orders, 'show'])
        router.post('orders/:id/items/:itemId/return', [controllers.Orders, 'returnItem'])
      })
      .prefix('customer')
      .as('customer')
      .use(middleware.auth())
  })
  .prefix('/api/v1')
