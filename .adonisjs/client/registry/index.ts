/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.new_account.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/signup',
    tokens: [{"old":"/api/v1/auth/signup","type":0,"val":"api","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['auth.new_account.store']['types'],
  },
  'auth.access_tokens.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [{"old":"/api/v1/auth/login","type":0,"val":"api","end":""},{"old":"/api/v1/auth/login","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/login","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.access_tokens.store']['types'],
  },
  'profile.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.profile.show']['types'],
  },
  'profile.access_tokens.destroy': {
    methods: ["POST"],
    pattern: '/api/v1/account/logout',
    tokens: [{"old":"/api/v1/account/logout","type":0,"val":"api","end":""},{"old":"/api/v1/account/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/account/logout","type":0,"val":"account","end":""},{"old":"/api/v1/account/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['profile.access_tokens.destroy']['types'],
  },
  'admin.stores.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/stores',
    tokens: [{"old":"/api/v1/admin/stores","type":0,"val":"api","end":""},{"old":"/api/v1/admin/stores","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/stores","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/stores","type":0,"val":"stores","end":""}],
    types: placeholder as Registry['admin.stores.index']['types'],
  },
  'admin.stores.store': {
    methods: ["POST"],
    pattern: '/api/v1/admin/stores',
    tokens: [{"old":"/api/v1/admin/stores","type":0,"val":"api","end":""},{"old":"/api/v1/admin/stores","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/stores","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/stores","type":0,"val":"stores","end":""}],
    types: placeholder as Registry['admin.stores.store']['types'],
  },
  'admin.stores.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/stores/:id',
    tokens: [{"old":"/api/v1/admin/stores/:id","type":0,"val":"api","end":""},{"old":"/api/v1/admin/stores/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/stores/:id","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/stores/:id","type":0,"val":"stores","end":""},{"old":"/api/v1/admin/stores/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.stores.show']['types'],
  },
  'admin.stores.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/v1/admin/stores/:id',
    tokens: [{"old":"/api/v1/admin/stores/:id","type":0,"val":"api","end":""},{"old":"/api/v1/admin/stores/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/stores/:id","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/stores/:id","type":0,"val":"stores","end":""},{"old":"/api/v1/admin/stores/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.stores.update']['types'],
  },
  'admin.stores.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/admin/stores/:id',
    tokens: [{"old":"/api/v1/admin/stores/:id","type":0,"val":"api","end":""},{"old":"/api/v1/admin/stores/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/stores/:id","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/stores/:id","type":0,"val":"stores","end":""},{"old":"/api/v1/admin/stores/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.stores.destroy']['types'],
  },
  'admin.products.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/products',
    tokens: [{"old":"/api/v1/admin/products","type":0,"val":"api","end":""},{"old":"/api/v1/admin/products","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/products","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/products","type":0,"val":"products","end":""}],
    types: placeholder as Registry['admin.products.index']['types'],
  },
  'admin.products.store': {
    methods: ["POST"],
    pattern: '/api/v1/admin/products',
    tokens: [{"old":"/api/v1/admin/products","type":0,"val":"api","end":""},{"old":"/api/v1/admin/products","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/products","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/products","type":0,"val":"products","end":""}],
    types: placeholder as Registry['admin.products.store']['types'],
  },
  'admin.products.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/products/:id',
    tokens: [{"old":"/api/v1/admin/products/:id","type":0,"val":"api","end":""},{"old":"/api/v1/admin/products/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/products/:id","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/products/:id","type":0,"val":"products","end":""},{"old":"/api/v1/admin/products/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.products.show']['types'],
  },
  'admin.products.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/v1/admin/products/:id',
    tokens: [{"old":"/api/v1/admin/products/:id","type":0,"val":"api","end":""},{"old":"/api/v1/admin/products/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/products/:id","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/products/:id","type":0,"val":"products","end":""},{"old":"/api/v1/admin/products/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.products.update']['types'],
  },
  'admin.products.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/admin/products/:id',
    tokens: [{"old":"/api/v1/admin/products/:id","type":0,"val":"api","end":""},{"old":"/api/v1/admin/products/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/products/:id","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/products/:id","type":0,"val":"products","end":""},{"old":"/api/v1/admin/products/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.products.destroy']['types'],
  },
  'admin.inventory.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/inventory',
    tokens: [{"old":"/api/v1/admin/inventory","type":0,"val":"api","end":""},{"old":"/api/v1/admin/inventory","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/inventory","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/inventory","type":0,"val":"inventory","end":""}],
    types: placeholder as Registry['admin.inventory.index']['types'],
  },
  'admin.inventory.store': {
    methods: ["POST"],
    pattern: '/api/v1/admin/inventory',
    tokens: [{"old":"/api/v1/admin/inventory","type":0,"val":"api","end":""},{"old":"/api/v1/admin/inventory","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/inventory","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/inventory","type":0,"val":"inventory","end":""}],
    types: placeholder as Registry['admin.inventory.store']['types'],
  },
  'admin.inventory.update': {
    methods: ["PUT"],
    pattern: '/api/v1/admin/inventory/:id',
    tokens: [{"old":"/api/v1/admin/inventory/:id","type":0,"val":"api","end":""},{"old":"/api/v1/admin/inventory/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/inventory/:id","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/inventory/:id","type":0,"val":"inventory","end":""},{"old":"/api/v1/admin/inventory/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.inventory.update']['types'],
  },
  'admin.discounts.index_product': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/product-discounts',
    tokens: [{"old":"/api/v1/admin/product-discounts","type":0,"val":"api","end":""},{"old":"/api/v1/admin/product-discounts","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/product-discounts","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/product-discounts","type":0,"val":"product-discounts","end":""}],
    types: placeholder as Registry['admin.discounts.index_product']['types'],
  },
  'admin.discounts.store_product': {
    methods: ["POST"],
    pattern: '/api/v1/admin/product-discounts',
    tokens: [{"old":"/api/v1/admin/product-discounts","type":0,"val":"api","end":""},{"old":"/api/v1/admin/product-discounts","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/product-discounts","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/product-discounts","type":0,"val":"product-discounts","end":""}],
    types: placeholder as Registry['admin.discounts.store_product']['types'],
  },
  'admin.discounts.update_product': {
    methods: ["PUT"],
    pattern: '/api/v1/admin/product-discounts/:id',
    tokens: [{"old":"/api/v1/admin/product-discounts/:id","type":0,"val":"api","end":""},{"old":"/api/v1/admin/product-discounts/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/product-discounts/:id","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/product-discounts/:id","type":0,"val":"product-discounts","end":""},{"old":"/api/v1/admin/product-discounts/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.discounts.update_product']['types'],
  },
  'admin.discounts.destroy_product': {
    methods: ["DELETE"],
    pattern: '/api/v1/admin/product-discounts/:id',
    tokens: [{"old":"/api/v1/admin/product-discounts/:id","type":0,"val":"api","end":""},{"old":"/api/v1/admin/product-discounts/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/product-discounts/:id","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/product-discounts/:id","type":0,"val":"product-discounts","end":""},{"old":"/api/v1/admin/product-discounts/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.discounts.destroy_product']['types'],
  },
  'admin.discounts.index_platform': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/platform-discounts',
    tokens: [{"old":"/api/v1/admin/platform-discounts","type":0,"val":"api","end":""},{"old":"/api/v1/admin/platform-discounts","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/platform-discounts","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/platform-discounts","type":0,"val":"platform-discounts","end":""}],
    types: placeholder as Registry['admin.discounts.index_platform']['types'],
  },
  'admin.discounts.store_platform': {
    methods: ["POST"],
    pattern: '/api/v1/admin/platform-discounts',
    tokens: [{"old":"/api/v1/admin/platform-discounts","type":0,"val":"api","end":""},{"old":"/api/v1/admin/platform-discounts","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/platform-discounts","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/platform-discounts","type":0,"val":"platform-discounts","end":""}],
    types: placeholder as Registry['admin.discounts.store_platform']['types'],
  },
  'admin.discounts.update_platform': {
    methods: ["PUT"],
    pattern: '/api/v1/admin/platform-discounts/:id',
    tokens: [{"old":"/api/v1/admin/platform-discounts/:id","type":0,"val":"api","end":""},{"old":"/api/v1/admin/platform-discounts/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/platform-discounts/:id","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/platform-discounts/:id","type":0,"val":"platform-discounts","end":""},{"old":"/api/v1/admin/platform-discounts/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.discounts.update_platform']['types'],
  },
  'admin.discounts.destroy_platform': {
    methods: ["DELETE"],
    pattern: '/api/v1/admin/platform-discounts/:id',
    tokens: [{"old":"/api/v1/admin/platform-discounts/:id","type":0,"val":"api","end":""},{"old":"/api/v1/admin/platform-discounts/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/platform-discounts/:id","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/platform-discounts/:id","type":0,"val":"platform-discounts","end":""},{"old":"/api/v1/admin/platform-discounts/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.discounts.destroy_platform']['types'],
  },
  'admin.orders.admin_index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/orders',
    tokens: [{"old":"/api/v1/admin/orders","type":0,"val":"api","end":""},{"old":"/api/v1/admin/orders","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/orders","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/orders","type":0,"val":"orders","end":""}],
    types: placeholder as Registry['admin.orders.admin_index']['types'],
  },
  'admin.orders.admin_show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/orders/:id',
    tokens: [{"old":"/api/v1/admin/orders/:id","type":0,"val":"api","end":""},{"old":"/api/v1/admin/orders/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/orders/:id","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/orders/:id","type":0,"val":"orders","end":""},{"old":"/api/v1/admin/orders/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.orders.admin_show']['types'],
  },
  'admin.orders.update_status': {
    methods: ["PUT"],
    pattern: '/api/v1/admin/orders/:id',
    tokens: [{"old":"/api/v1/admin/orders/:id","type":0,"val":"api","end":""},{"old":"/api/v1/admin/orders/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/orders/:id","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/orders/:id","type":0,"val":"orders","end":""},{"old":"/api/v1/admin/orders/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.orders.update_status']['types'],
  },
  'customer.products.customer_index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/customer/products',
    tokens: [{"old":"/api/v1/customer/products","type":0,"val":"api","end":""},{"old":"/api/v1/customer/products","type":0,"val":"v1","end":""},{"old":"/api/v1/customer/products","type":0,"val":"customer","end":""},{"old":"/api/v1/customer/products","type":0,"val":"products","end":""}],
    types: placeholder as Registry['customer.products.customer_index']['types'],
  },
  'customer.products.customer_show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/customer/products/:id',
    tokens: [{"old":"/api/v1/customer/products/:id","type":0,"val":"api","end":""},{"old":"/api/v1/customer/products/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/customer/products/:id","type":0,"val":"customer","end":""},{"old":"/api/v1/customer/products/:id","type":0,"val":"products","end":""},{"old":"/api/v1/customer/products/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['customer.products.customer_show']['types'],
  },
  'customer.cart.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/customer/cart',
    tokens: [{"old":"/api/v1/customer/cart","type":0,"val":"api","end":""},{"old":"/api/v1/customer/cart","type":0,"val":"v1","end":""},{"old":"/api/v1/customer/cart","type":0,"val":"customer","end":""},{"old":"/api/v1/customer/cart","type":0,"val":"cart","end":""}],
    types: placeholder as Registry['customer.cart.show']['types'],
  },
  'customer.cart.store': {
    methods: ["POST"],
    pattern: '/api/v1/customer/cart',
    tokens: [{"old":"/api/v1/customer/cart","type":0,"val":"api","end":""},{"old":"/api/v1/customer/cart","type":0,"val":"v1","end":""},{"old":"/api/v1/customer/cart","type":0,"val":"customer","end":""},{"old":"/api/v1/customer/cart","type":0,"val":"cart","end":""}],
    types: placeholder as Registry['customer.cart.store']['types'],
  },
  'customer.cart.clear': {
    methods: ["DELETE"],
    pattern: '/api/v1/customer/cart',
    tokens: [{"old":"/api/v1/customer/cart","type":0,"val":"api","end":""},{"old":"/api/v1/customer/cart","type":0,"val":"v1","end":""},{"old":"/api/v1/customer/cart","type":0,"val":"customer","end":""},{"old":"/api/v1/customer/cart","type":0,"val":"cart","end":""}],
    types: placeholder as Registry['customer.cart.clear']['types'],
  },
  'customer.cart.update': {
    methods: ["PUT"],
    pattern: '/api/v1/customer/cart/items/:id',
    tokens: [{"old":"/api/v1/customer/cart/items/:id","type":0,"val":"api","end":""},{"old":"/api/v1/customer/cart/items/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/customer/cart/items/:id","type":0,"val":"customer","end":""},{"old":"/api/v1/customer/cart/items/:id","type":0,"val":"cart","end":""},{"old":"/api/v1/customer/cart/items/:id","type":0,"val":"items","end":""},{"old":"/api/v1/customer/cart/items/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['customer.cart.update']['types'],
  },
  'customer.cart.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/customer/cart/items/:id',
    tokens: [{"old":"/api/v1/customer/cart/items/:id","type":0,"val":"api","end":""},{"old":"/api/v1/customer/cart/items/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/customer/cart/items/:id","type":0,"val":"customer","end":""},{"old":"/api/v1/customer/cart/items/:id","type":0,"val":"cart","end":""},{"old":"/api/v1/customer/cart/items/:id","type":0,"val":"items","end":""},{"old":"/api/v1/customer/cart/items/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['customer.cart.destroy']['types'],
  },
  'customer.orders.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/customer/orders',
    tokens: [{"old":"/api/v1/customer/orders","type":0,"val":"api","end":""},{"old":"/api/v1/customer/orders","type":0,"val":"v1","end":""},{"old":"/api/v1/customer/orders","type":0,"val":"customer","end":""},{"old":"/api/v1/customer/orders","type":0,"val":"orders","end":""}],
    types: placeholder as Registry['customer.orders.index']['types'],
  },
  'customer.orders.store': {
    methods: ["POST"],
    pattern: '/api/v1/customer/orders',
    tokens: [{"old":"/api/v1/customer/orders","type":0,"val":"api","end":""},{"old":"/api/v1/customer/orders","type":0,"val":"v1","end":""},{"old":"/api/v1/customer/orders","type":0,"val":"customer","end":""},{"old":"/api/v1/customer/orders","type":0,"val":"orders","end":""}],
    types: placeholder as Registry['customer.orders.store']['types'],
  },
  'customer.orders.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/customer/orders/:id',
    tokens: [{"old":"/api/v1/customer/orders/:id","type":0,"val":"api","end":""},{"old":"/api/v1/customer/orders/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/customer/orders/:id","type":0,"val":"customer","end":""},{"old":"/api/v1/customer/orders/:id","type":0,"val":"orders","end":""},{"old":"/api/v1/customer/orders/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['customer.orders.show']['types'],
  },
  'customer.orders.return_item': {
    methods: ["POST"],
    pattern: '/api/v1/customer/orders/:id/items/:itemId/return',
    tokens: [{"old":"/api/v1/customer/orders/:id/items/:itemId/return","type":0,"val":"api","end":""},{"old":"/api/v1/customer/orders/:id/items/:itemId/return","type":0,"val":"v1","end":""},{"old":"/api/v1/customer/orders/:id/items/:itemId/return","type":0,"val":"customer","end":""},{"old":"/api/v1/customer/orders/:id/items/:itemId/return","type":0,"val":"orders","end":""},{"old":"/api/v1/customer/orders/:id/items/:itemId/return","type":1,"val":"id","end":""},{"old":"/api/v1/customer/orders/:id/items/:itemId/return","type":0,"val":"items","end":""},{"old":"/api/v1/customer/orders/:id/items/:itemId/return","type":1,"val":"itemId","end":""},{"old":"/api/v1/customer/orders/:id/items/:itemId/return","type":0,"val":"return","end":""}],
    types: placeholder as Registry['customer.orders.return_item']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
