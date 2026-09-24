/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessTokens: {
      store: typeof routes['auth.access_tokens.store']
    }
  }
  profile: {
    profile: {
      show: typeof routes['profile.profile.show']
    }
    accessTokens: {
      destroy: typeof routes['profile.access_tokens.destroy']
    }
  }
  admin: {
    stores: {
      index: typeof routes['admin.stores.index']
      store: typeof routes['admin.stores.store']
      show: typeof routes['admin.stores.show']
      update: typeof routes['admin.stores.update']
      destroy: typeof routes['admin.stores.destroy']
    }
    products: {
      index: typeof routes['admin.products.index']
      store: typeof routes['admin.products.store']
      show: typeof routes['admin.products.show']
      update: typeof routes['admin.products.update']
      destroy: typeof routes['admin.products.destroy']
    }
    inventory: {
      index: typeof routes['admin.inventory.index']
      store: typeof routes['admin.inventory.store']
      update: typeof routes['admin.inventory.update']
    }
    discounts: {
      indexProduct: typeof routes['admin.discounts.index_product']
      storeProduct: typeof routes['admin.discounts.store_product']
      updateProduct: typeof routes['admin.discounts.update_product']
      destroyProduct: typeof routes['admin.discounts.destroy_product']
      indexPlatform: typeof routes['admin.discounts.index_platform']
      storePlatform: typeof routes['admin.discounts.store_platform']
      updatePlatform: typeof routes['admin.discounts.update_platform']
      destroyPlatform: typeof routes['admin.discounts.destroy_platform']
    }
    orders: {
      adminIndex: typeof routes['admin.orders.admin_index']
      adminShow: typeof routes['admin.orders.admin_show']
      updateStatus: typeof routes['admin.orders.update_status']
    }
  }
  customer: {
    products: {
      customerIndex: typeof routes['customer.products.customer_index']
      customerShow: typeof routes['customer.products.customer_show']
    }
    cart: {
      show: typeof routes['customer.cart.show']
      store: typeof routes['customer.cart.store']
      clear: typeof routes['customer.cart.clear']
      update: typeof routes['customer.cart.update']
      destroy: typeof routes['customer.cart.destroy']
    }
    orders: {
      index: typeof routes['customer.orders.index']
      store: typeof routes['customer.orders.store']
      show: typeof routes['customer.orders.show']
      returnItem: typeof routes['customer.orders.return_item']
    }
  }
}
