export interface User {
  id: number
  fullName: string | null
  email: string
  role: 'admin' | 'customer'
  createdAt?: string
  updatedAt?: string
  initials?: string
}

export interface AuthResponse {
  type?: string
  token: string
  user: User
  abilities?: string[]
}

export interface Store {
  id: number
  name: string
  address: string
  latitude: number | string
  longitude: number | string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Product {
  id: number
  name: string
  description: string | null
  price: number | string
  imageUrl: string | null
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface InventoryItem {
  id: number
  storeId: number
  productId: number
  quantity: number
  store?: { id: number; name: string }
  product?: { id: number; name: string }
}

export interface ProductDiscount {
  id: number
  productId: number
  minQuantity: number
  discountPercentage: number | string
  isActive: boolean
  product?: { id: number; name: string }
}

export interface PlatformDiscount {
  id: number
  name: string
  minOrderAmount: number | string
  discountPercentage: number | string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface OrderItem {
  id: number
  productId: number
  storeId: number
  quantity: number
  returnedQuantity: number
  unitPrice: number | string
  totalPrice: number | string
  product?: { id: number; name: string; imageUrl: string | null }
  store?: { id: number; name: string }
}

export type OrderStatus = 'placed' | 'processing' | 'completed' | 'cancelled' | 'returned'
export type DiscountType = 'product' | 'platform' | null

export interface Order {
  id: number
  userId: number
  subtotal: number | string
  productDiscountAmount: number | string
  platformDiscountAmount: number | string
  total: number | string
  deliveryAddress: string
  discountType: DiscountType
  status: OrderStatus
  createdAt?: string
  updatedAt?: string
  items: OrderItem[]
  user?: { id: number; fullName: string | null; email: string }
}

export interface CartItem {
  id: number
  productId: number
  quantity: number
  product?: { id: number; name: string; price: number | string; imageUrl: string | null }
}

export interface Cart {
  id: number
  items: CartItem[]
  discountType: DiscountType
  productDiscountAmount: number | string
  platformDiscountAmount: number | string
  subtotal: number | string
  total: number | string
}

export interface PaginationMeta {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  firstPage: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface FieldError {
  field: string
  message: string
  rule?: string
}

export class ApiError extends Error {
  fieldErrors: FieldError[]

  constructor(message: string, fieldErrors: FieldError[] = []) {
    super(message)
    this.name = 'ApiError'
    this.fieldErrors = fieldErrors
  }

  fieldMessage(field: string): string | undefined {
    return this.fieldErrors.find((e) => e.field === field)?.message
  }
}

const TOKEN_KEY = 'orderly_auth_token'
const USER_KEY = 'orderly_auth_user'

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const setStoredUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const clearAuthStorage = (): void => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

// AdonisJS's BaseSerializer (via ctx.serialize) wraps each transformed record as
// { $type: 'item', transformerData: [fields, relations], ... } — this is meant to be
// consumed by the Tuyau typed client, which this hand-rolled fetch client doesn't use.
// Recursively strip that envelope so callers just see plain field objects/arrays.
function unwrapTransformerEnvelope(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(unwrapTransformerEnvelope)
  }
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>
    if (obj.$type === 'item' && Array.isArray(obj.transformerData)) {
      const [fields] = obj.transformerData as [Record<string, unknown>, unknown]
      return unwrapTransformerEnvelope(fields)
    }
    const result: Record<string, unknown> = {}
    for (const key of Object.keys(obj)) {
      result[key] = unwrapTransformerEnvelope(obj[key])
    }
    return result
  }
  return value
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  })

  if (response.status === 204) {
    return {} as T
  }

  const raw = await response.json().catch(() => ({}))

  if (!response.ok) {
    const fieldErrors: FieldError[] = Array.isArray(raw.errors)
      ? raw.errors.filter((e: unknown): e is FieldError => !!e && typeof (e as FieldError).field === 'string')
      : []
    const message =
      raw.errors?.[0]?.message ||
      raw.message ||
      (response.status === 400
        ? 'Invalid email or password.'
        : `Request failed with status ${response.status}`)
    throw new ApiError(message, fieldErrors)
  }

  // Automatically unwrap AdonisJS serialize { data: ... } wrapper if present
  const unwrappedData =
    raw && typeof raw === 'object' && 'data' in raw && !Array.isArray(raw) ? raw.data : raw

  return unwrapTransformerEnvelope(unwrappedData) as T
}

// Like request(), but for paginated list endpoints — keeps { data, metadata }
// intact instead of unwrapping straight to the array, so callers get page info too.
async function requestPaginated<T>(
  endpoint: string,
  params: { page?: number; perPage?: number; search?: string; sortBy?: string; sortDir?: 'asc' | 'desc' } = {}
): Promise<PaginatedResponse<T>> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const url = new URL(endpoint, window.location.origin)
  if (params.page) url.searchParams.set('page', String(params.page))
  if (params.perPage) url.searchParams.set('perPage', String(params.perPage))
  if (params.search) url.searchParams.set('search', params.search)
  if (params.sortBy) url.searchParams.set('sortBy', params.sortBy)
  if (params.sortDir) url.searchParams.set('sortDir', params.sortDir)

  const response = await fetch(url.toString(), { headers })
  const raw = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message = raw.errors?.[0]?.message || raw.message || `Request failed with status ${response.status}`
    throw new Error(message)
  }

  return {
    data: unwrapTransformerEnvelope(raw.data) as T[],
    meta: raw.metadata as PaginationMeta,
  }
}

export const api = {
  auth: {
    signup: async (payload: {
      fullName?: string
      email: string
      password: string
      passwordConfirmation: string
    }) => {
      return request<AuthResponse>('/api/v1/auth/signup', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
    },

    login: async (payload: { email: string; password: string }) => {
      return request<AuthResponse>('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
    },

    profile: async () => {
      return request<User>('/api/v1/account/profile')
    },

    logout: async () => {
      try {
        await request('/api/v1/account/logout', { method: 'POST' })
      } finally {
        clearAuthStorage()
      }
    },
  },

  admin: {
    stores: {
      list: async (params?: { page?: number; perPage?: number; search?: string }) =>
        requestPaginated<Store>('/api/v1/admin/stores', params),
      get: async (id: number) => request<Store>(`/api/v1/admin/stores/${id}`),
      create: async (payload: {
        name: string
        address: string
        latitude: number
        longitude: number
        isActive?: boolean
      }) =>
        request<Store>('/api/v1/admin/stores', {
          method: 'POST',
          body: JSON.stringify(payload),
        }),
      update: async (id: number, payload: Partial<{
        name: string
        address: string
        latitude: number
        longitude: number
        isActive: boolean
      }>) =>
        request<Store>(`/api/v1/admin/stores/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        }),
      delete: async (id: number) =>
        request<void>(`/api/v1/admin/stores/${id}`, { method: 'DELETE' }),
    },

    products: {
      list: async (
        params?: { page?: number; perPage?: number; search?: string; sortBy?: string; sortDir?: 'asc' | 'desc' }
      ) =>
        requestPaginated<Product>('/api/v1/admin/products', params),
      get: async (id: number) => request<Product>(`/api/v1/admin/products/${id}`),
      create: async (payload: {
        name: string
        description?: string
        price: number
        imageUrl?: string
        isActive?: boolean
      }) =>
        request<Product>('/api/v1/admin/products', {
          method: 'POST',
          body: JSON.stringify(payload),
        }),
      update: async (id: number, payload: Partial<{
        name: string
        description: string
        price: number
        imageUrl: string
        isActive: boolean
      }>) =>
        request<Product>(`/api/v1/admin/products/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        }),
      delete: async (id: number) =>
        request<void>(`/api/v1/admin/products/${id}`, { method: 'DELETE' }),
    },

    inventory: {
      list: async (params?: { page?: number; perPage?: number; search?: string }) =>
        requestPaginated<InventoryItem>('/api/v1/admin/inventory', params),
      set: async (payload: { storeId: number; productId: number; quantity: number }) =>
        request<InventoryItem>('/api/v1/admin/inventory', {
          method: 'POST',
          body: JSON.stringify(payload),
        }),
      update: async (id: number, payload: { quantity: number }) =>
        request<InventoryItem>(`/api/v1/admin/inventory/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        }),
    },

    productDiscounts: {
      list: async (params?: { page?: number; perPage?: number; search?: string }) =>
        requestPaginated<ProductDiscount>('/api/v1/admin/product-discounts', params),
      create: async (payload: {
        productId: number
        minQuantity: number
        discountPercentage: number
        isActive?: boolean
      }) =>
        request<ProductDiscount>('/api/v1/admin/product-discounts', {
          method: 'POST',
          body: JSON.stringify(payload),
        }),
      update: async (id: number, payload: Partial<{
        productId: number
        minQuantity: number
        discountPercentage: number
        isActive: boolean
      }>) =>
        request<ProductDiscount>(`/api/v1/admin/product-discounts/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        }),
      delete: async (id: number) =>
        request<void>(`/api/v1/admin/product-discounts/${id}`, { method: 'DELETE' }),
    },

    platformDiscounts: {
      list: async (params?: { page?: number; perPage?: number; search?: string }) =>
        requestPaginated<PlatformDiscount>('/api/v1/admin/platform-discounts', params),
      create: async (payload: {
        name: string
        minOrderAmount: number
        discountPercentage: number
        isActive?: boolean
      }) =>
        request<PlatformDiscount>('/api/v1/admin/platform-discounts', {
          method: 'POST',
          body: JSON.stringify(payload),
        }),
      update: async (id: number, payload: Partial<{
        name: string
        minOrderAmount: number
        discountPercentage: number
        isActive: boolean
      }>) =>
        request<PlatformDiscount>(`/api/v1/admin/platform-discounts/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        }),
      delete: async (id: number) =>
        request<void>(`/api/v1/admin/platform-discounts/${id}`, { method: 'DELETE' }),
    },

    orders: {
      list: async (params?: { page?: number; perPage?: number; search?: string }) =>
        requestPaginated<Order>('/api/v1/admin/orders', params),
      get: async (id: number) => request<Order>(`/api/v1/admin/orders/${id}`),
      updateStatus: async (id: number, status: OrderStatus) =>
        request<Order>(`/api/v1/admin/orders/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ status }),
        }),
    },
  },

  customer: {
    products: {
      list: async (
        params?: { page?: number; perPage?: number; search?: string; sortBy?: string; sortDir?: 'asc' | 'desc' }
      ) =>
        requestPaginated<Product>('/api/v1/customer/products', params),
      get: async (id: number) => request<Product>(`/api/v1/customer/products/${id}`),
    },

    cart: {
      get: async () => request<Cart>('/api/v1/customer/cart'),
      add: async (payload: { productId: number; quantity: number }) =>
        request<Cart>('/api/v1/customer/cart', {
          method: 'POST',
          body: JSON.stringify(payload),
        }),
      updateItem: async (itemId: number, quantity: number) =>
        request<Cart>(`/api/v1/customer/cart/items/${itemId}`, {
          method: 'PUT',
          body: JSON.stringify({ quantity }),
        }),
      removeItem: async (itemId: number) =>
        request<void>(`/api/v1/customer/cart/items/${itemId}`, { method: 'DELETE' }),
      clear: async () => request<void>('/api/v1/customer/cart', { method: 'DELETE' }),
    },

    orders: {
      list: async (params?: { page?: number; perPage?: number; search?: string }) =>
        requestPaginated<Order>('/api/v1/customer/orders', params),
      get: async (id: number) => request<Order>(`/api/v1/customer/orders/${id}`),
      place: async (payload: { deliveryAddress: string; latitude?: number; longitude?: number }) =>
        request<Order>('/api/v1/customer/orders', {
          method: 'POST',
          body: JSON.stringify(payload),
        }),
      returnItem: async (orderId: number, itemId: number, quantity: number) =>
        request<Order>(`/api/v1/customer/orders/${orderId}/items/${itemId}/return`, {
          method: 'POST',
          body: JSON.stringify({ quantity }),
        }),
    },
  },
}
