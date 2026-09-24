/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'auth.new_account.store': {
    methods: ["POST"]
    pattern: '/api/v1/auth/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.access_tokens.store': {
    methods: ["POST"]
    pattern: '/api/v1/auth/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'profile.profile.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/account/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
    }
  }
  'profile.access_tokens.destroy': {
    methods: ["POST"]
    pattern: '/api/v1/account/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['destroy']>>>
    }
  }
  'admin.stores.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/stores'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/stores_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/stores_controller').default['index']>>>
    }
  }
  'admin.stores.store': {
    methods: ["POST"]
    pattern: '/api/v1/admin/stores'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/store').createStoreValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/store').createStoreValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/stores_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/stores_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.stores.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/stores/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/stores_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/stores_controller').default['show']>>>
    }
  }
  'admin.stores.update': {
    methods: ["PUT","PATCH"]
    pattern: '/api/v1/admin/stores/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/store').updateStoreValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/store').updateStoreValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/stores_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/stores_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.stores.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/admin/stores/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/stores_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/stores_controller').default['destroy']>>>
    }
  }
  'admin.products.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/products'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/products_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/products_controller').default['index']>>>
    }
  }
  'admin.products.store': {
    methods: ["POST"]
    pattern: '/api/v1/admin/products'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/product').createProductValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/product').createProductValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/products_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/products_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.products.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/products/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/products_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/products_controller').default['show']>>>
    }
  }
  'admin.products.update': {
    methods: ["PUT","PATCH"]
    pattern: '/api/v1/admin/products/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/product').updateProductValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/product').updateProductValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/products_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/products_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.products.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/admin/products/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/products_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/products_controller').default['destroy']>>>
    }
  }
  'admin.inventory.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/inventory'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inventory_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inventory_controller').default['index']>>>
    }
  }
  'admin.inventory.store': {
    methods: ["POST"]
    pattern: '/api/v1/admin/inventory'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/inventory').setInventoryValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/inventory').setInventoryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inventory_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inventory_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.inventory.update': {
    methods: ["PUT"]
    pattern: '/api/v1/admin/inventory/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/inventory').updateInventoryValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/inventory').updateInventoryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inventory_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inventory_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.discounts.index_product': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/product-discounts'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/discounts_controller').default['indexProduct']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/discounts_controller').default['indexProduct']>>>
    }
  }
  'admin.discounts.store_product': {
    methods: ["POST"]
    pattern: '/api/v1/admin/product-discounts'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/discount').createProductDiscountValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/discount').createProductDiscountValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/discounts_controller').default['storeProduct']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/discounts_controller').default['storeProduct']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.discounts.update_product': {
    methods: ["PUT"]
    pattern: '/api/v1/admin/product-discounts/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/discount').updateProductDiscountValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/discount').updateProductDiscountValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/discounts_controller').default['updateProduct']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/discounts_controller').default['updateProduct']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.discounts.destroy_product': {
    methods: ["DELETE"]
    pattern: '/api/v1/admin/product-discounts/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/discounts_controller').default['destroyProduct']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/discounts_controller').default['destroyProduct']>>>
    }
  }
  'admin.discounts.index_platform': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/platform-discounts'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/discounts_controller').default['indexPlatform']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/discounts_controller').default['indexPlatform']>>>
    }
  }
  'admin.discounts.store_platform': {
    methods: ["POST"]
    pattern: '/api/v1/admin/platform-discounts'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/discount').createPlatformDiscountValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/discount').createPlatformDiscountValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/discounts_controller').default['storePlatform']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/discounts_controller').default['storePlatform']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.discounts.update_platform': {
    methods: ["PUT"]
    pattern: '/api/v1/admin/platform-discounts/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/discount').updatePlatformDiscountValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/discount').updatePlatformDiscountValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/discounts_controller').default['updatePlatform']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/discounts_controller').default['updatePlatform']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.discounts.destroy_platform': {
    methods: ["DELETE"]
    pattern: '/api/v1/admin/platform-discounts/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/discounts_controller').default['destroyPlatform']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/discounts_controller').default['destroyPlatform']>>>
    }
  }
  'admin.orders.admin_index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/orders'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/orders_controller').default['adminIndex']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/orders_controller').default['adminIndex']>>>
    }
  }
  'admin.orders.admin_show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/orders/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/orders_controller').default['adminShow']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/orders_controller').default['adminShow']>>>
    }
  }
  'admin.orders.update_status': {
    methods: ["PUT"]
    pattern: '/api/v1/admin/orders/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/order').updateOrderStatusValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/order').updateOrderStatusValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/orders_controller').default['updateStatus']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/orders_controller').default['updateStatus']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'customer.products.customer_index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/customer/products'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/products_controller').default['customerIndex']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/products_controller').default['customerIndex']>>>
    }
  }
  'customer.products.customer_show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/customer/products/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/products_controller').default['customerShow']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/products_controller').default['customerShow']>>>
    }
  }
  'customer.cart.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/customer/cart'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cart_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cart_controller').default['show']>>>
    }
  }
  'customer.cart.store': {
    methods: ["POST"]
    pattern: '/api/v1/customer/cart'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/cart').addToCartValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/cart').addToCartValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cart_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cart_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'customer.cart.clear': {
    methods: ["DELETE"]
    pattern: '/api/v1/customer/cart'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cart_controller').default['clear']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cart_controller').default['clear']>>>
    }
  }
  'customer.cart.update': {
    methods: ["PUT"]
    pattern: '/api/v1/customer/cart/items/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/cart').updateCartItemValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/cart').updateCartItemValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cart_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cart_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'customer.cart.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/customer/cart/items/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cart_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cart_controller').default['destroy']>>>
    }
  }
  'customer.orders.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/customer/orders'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/orders_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/orders_controller').default['index']>>>
    }
  }
  'customer.orders.store': {
    methods: ["POST"]
    pattern: '/api/v1/customer/orders'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/order').placeOrderValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/order').placeOrderValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/orders_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/orders_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'customer.orders.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/customer/orders/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/orders_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/orders_controller').default['show']>>>
    }
  }
  'customer.orders.return_item': {
    methods: ["POST"]
    pattern: '/api/v1/customer/orders/:id/items/:itemId/return'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/order').returnOrderItemValidator)>>
      paramsTuple: [ParamValue, ParamValue]
      params: { id: ParamValue; itemId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/order').returnOrderItemValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/orders_controller').default['returnItem']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/orders_controller').default['returnItem']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
}
