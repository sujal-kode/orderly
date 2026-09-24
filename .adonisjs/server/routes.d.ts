import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'admin.stores.index': { paramsTuple?: []; params?: {} }
    'admin.stores.store': { paramsTuple?: []; params?: {} }
    'admin.stores.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.stores.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.stores.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.products.index': { paramsTuple?: []; params?: {} }
    'admin.products.store': { paramsTuple?: []; params?: {} }
    'admin.products.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.products.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.products.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.inventory.index': { paramsTuple?: []; params?: {} }
    'admin.inventory.store': { paramsTuple?: []; params?: {} }
    'admin.inventory.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.discounts.index_product': { paramsTuple?: []; params?: {} }
    'admin.discounts.store_product': { paramsTuple?: []; params?: {} }
    'admin.discounts.update_product': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.discounts.destroy_product': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.discounts.index_platform': { paramsTuple?: []; params?: {} }
    'admin.discounts.store_platform': { paramsTuple?: []; params?: {} }
    'admin.discounts.update_platform': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.discounts.destroy_platform': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.orders.admin_index': { paramsTuple?: []; params?: {} }
    'admin.orders.admin_show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.orders.update_status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'customer.products.customer_index': { paramsTuple?: []; params?: {} }
    'customer.products.customer_show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'customer.cart.show': { paramsTuple?: []; params?: {} }
    'customer.cart.store': { paramsTuple?: []; params?: {} }
    'customer.cart.clear': { paramsTuple?: []; params?: {} }
    'customer.cart.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'customer.cart.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'customer.orders.index': { paramsTuple?: []; params?: {} }
    'customer.orders.store': { paramsTuple?: []; params?: {} }
    'customer.orders.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'customer.orders.return_item': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'itemId': ParamValue} }
  }
  GET: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'admin.stores.index': { paramsTuple?: []; params?: {} }
    'admin.stores.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.products.index': { paramsTuple?: []; params?: {} }
    'admin.products.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.inventory.index': { paramsTuple?: []; params?: {} }
    'admin.discounts.index_product': { paramsTuple?: []; params?: {} }
    'admin.discounts.index_platform': { paramsTuple?: []; params?: {} }
    'admin.orders.admin_index': { paramsTuple?: []; params?: {} }
    'admin.orders.admin_show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'customer.products.customer_index': { paramsTuple?: []; params?: {} }
    'customer.products.customer_show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'customer.cart.show': { paramsTuple?: []; params?: {} }
    'customer.orders.index': { paramsTuple?: []; params?: {} }
    'customer.orders.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'admin.stores.index': { paramsTuple?: []; params?: {} }
    'admin.stores.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.products.index': { paramsTuple?: []; params?: {} }
    'admin.products.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.inventory.index': { paramsTuple?: []; params?: {} }
    'admin.discounts.index_product': { paramsTuple?: []; params?: {} }
    'admin.discounts.index_platform': { paramsTuple?: []; params?: {} }
    'admin.orders.admin_index': { paramsTuple?: []; params?: {} }
    'admin.orders.admin_show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'customer.products.customer_index': { paramsTuple?: []; params?: {} }
    'customer.products.customer_show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'customer.cart.show': { paramsTuple?: []; params?: {} }
    'customer.orders.index': { paramsTuple?: []; params?: {} }
    'customer.orders.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'admin.stores.store': { paramsTuple?: []; params?: {} }
    'admin.products.store': { paramsTuple?: []; params?: {} }
    'admin.inventory.store': { paramsTuple?: []; params?: {} }
    'admin.discounts.store_product': { paramsTuple?: []; params?: {} }
    'admin.discounts.store_platform': { paramsTuple?: []; params?: {} }
    'customer.cart.store': { paramsTuple?: []; params?: {} }
    'customer.orders.store': { paramsTuple?: []; params?: {} }
    'customer.orders.return_item': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'itemId': ParamValue} }
  }
  PUT: {
    'admin.stores.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.products.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.inventory.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.discounts.update_product': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.discounts.update_platform': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.orders.update_status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'customer.cart.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'admin.stores.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.products.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'admin.stores.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.products.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.discounts.destroy_product': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.discounts.destroy_platform': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'customer.cart.clear': { paramsTuple?: []; params?: {} }
    'customer.cart.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}