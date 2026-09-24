import React, { useEffect, useState } from 'react'
import { Package, MapPin, ChevronDown, ChevronUp, Undo2, X, Loader2 } from 'lucide-react'
import { Pagination } from '../../components/Pagination.js'
import { SearchInput } from '../../components/SearchInput.js'
import { useToast } from '../../context/ToastContext.js'
import { api, type Order, type OrderItem, type OrderStatus, type PaginationMeta } from '../../services/api.js'

interface OrdersPageProps {
  navigate: (path: string) => void
  orderId?: number
}

const STATUS_STYLES: Record<OrderStatus, string> = {
  placed: 'bg-blue-50 text-blue-700 border-blue-200',
  processing: 'bg-amber-50 text-amber-700 border-amber-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
  returned: 'bg-purple-50 text-purple-700 border-purple-200',
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ navigate, orderId }) => {
  const { showToast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(orderId ?? null)

  const [returnTarget, setReturnTarget] = useState<{ order: Order; item: OrderItem } | null>(null)
  const [returnQuantity, setReturnQuantity] = useState(1)
  const [returning, setReturning] = useState(false)
  const [returnError, setReturnError] = useState<string | null>(null)

  const load = async () => {
    setIsLoading(true)
    try {
      const res = await api.customer.orders.list({ page, perPage: 10, search: debouncedSearch || undefined })
      setOrders(res.data)
      setMeta(res.meta)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load orders.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch])

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(search), 350)
    return () => clearTimeout(handle)
  }, [search])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  useEffect(() => {
    if (orderId) setExpandedId(orderId)
  }, [orderId])

  const openReturn = (order: Order, item: OrderItem) => {
    setReturnTarget({ order, item })
    setReturnQuantity(1)
    setReturnError(null)
  }

  const handleReturn = async () => {
    if (!returnTarget) return
    const remaining = returnTarget.item.quantity - returnTarget.item.returnedQuantity
    if (returnQuantity < 1 || returnQuantity > remaining) {
      setReturnError(`Enter a quantity between 1 and ${remaining}.`)
      return
    }
    setReturning(true)
    setReturnError(null)
    try {
      const updated = await api.customer.orders.returnItem(returnTarget.order.id, returnTarget.item.id, returnQuantity)
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
      showToast('Return processed successfully.')
      setReturnTarget(null)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to process return.'
      setReturnError(message)
      showToast(message, 'error')
    } finally {
      setReturning(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-[#f8f9ff] px-4 md:px-6 py-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0b1c30] tracking-tight">My Orders</h1>
          <p className="text-sm text-[#444653] mt-0.5">Track your order history and delivery status.</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] text-sm">
            {error}
          </div>
        )}

        <SearchInput value={search} onChange={setSearch} placeholder="Search by order ID or product name…" className="max-w-sm" />

        {isLoading ? (
          <div className="text-sm text-[#444653]">Loading orders…</div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#c4c5d5]/40 p-12 text-center flex flex-col items-center gap-3">
            <Package className="w-10 h-10 text-[#c4c5d5]" />
            <p className="text-sm text-[#444653]">You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate('/app')}
              className="inline-flex items-center h-9 px-4 rounded-md bg-[#1e40af] hover:bg-[#00288e] text-white text-sm font-medium transition-colors cursor-pointer"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => {
              const expanded = expandedId === order.id
              return (
                <div key={order.id} className="bg-white rounded-lg border border-[#c4c5d5]/40 shadow-sm overflow-hidden">
                  <button
                    onClick={() => setExpandedId(expanded ? null : order.id)}
                    className="w-full p-5 flex items-center justify-between gap-4 cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#00288e] shrink-0">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0b1c30]">#ORD-{order.id}</p>
                        <p className="text-xs text-[#444653]">
                          {order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border capitalize ${STATUS_STYLES[order.status]}`}
                      >
                        {order.status}
                      </span>
                      <span className="text-sm font-bold text-[#0b1c30] tabular-nums">
                        ₹{Number(order.total).toLocaleString('en-IN')}
                      </span>
                      {expanded ? (
                        <ChevronUp className="w-4 h-4 text-[#444653]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#444653]" />
                      )}
                    </div>
                  </button>

                  {expanded && (
                    <div className="border-t border-[#c4c5d5]/30 p-5 flex flex-col gap-5">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#444653]">
                          Items ({order.items?.length ?? 0})
                        </span>
                        <div className="mt-2 flex flex-col gap-2">
                          {order.items?.map((item) => {
                            const remaining = item.quantity - item.returnedQuantity
                            const canReturn =
                              remaining > 0 && order.status !== 'cancelled' && order.status !== 'returned'
                            return (
                              <div
                                key={item.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-[#eff4ff]"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 overflow-hidden">
                                    {item.product?.imageUrl ? (
                                      <img src={item.product.imageUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      <Package className="w-4 h-4 text-[#00288e]" />
                                    )}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium text-[#0b1c30]">{item.product?.name}</span>
                                    <span className="text-xs text-[#444653] flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {item.store?.name} • Qty {item.quantity}
                                      {item.returnedQuantity > 0 && ` (${item.returnedQuantity} returned)`}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-semibold text-[#0b1c30] tabular-nums">
                                    ₹{Number(item.totalPrice).toLocaleString('en-IN')}
                                  </span>
                                  {canReturn && (
                                    <button
                                      onClick={() => openReturn(order, item)}
                                      className="inline-flex items-center gap-1 px-2 py-1 rounded border border-[#c4c5d5] bg-white text-xs font-medium text-[#00288e] hover:bg-[#eff4ff] transition-colors cursor-pointer"
                                    >
                                      <Undo2 className="w-3 h-3" />
                                      Return
                                    </button>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5 p-4 rounded-lg bg-[#eff4ff]">
                        <div className="flex items-center justify-between text-sm text-[#444653]">
                          <span>Subtotal</span>
                          <span className="tabular-nums">₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
                        </div>
                        {Number(order.productDiscountAmount) > 0 && (
                          <div className="flex items-center justify-between text-sm text-emerald-700">
                            <span>Product Discount</span>
                            <span className="tabular-nums">
                              -₹{Number(order.productDiscountAmount).toLocaleString('en-IN')}
                            </span>
                          </div>
                        )}
                        {Number(order.platformDiscountAmount) > 0 && (
                          <div className="flex items-center justify-between text-sm text-emerald-700">
                            <span>Platform Discount</span>
                            <span className="tabular-nums">
                              -₹{Number(order.platformDiscountAmount).toLocaleString('en-IN')}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-base font-bold text-[#0b1c30] pt-1.5 border-t border-[#c4c5d5]/40">
                          <span>Total</span>
                          <span className="tabular-nums">₹{Number(order.total).toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      {order.deliveryAddress && (
                        <div className="flex items-start gap-2 text-sm text-[#444653]">
                          <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[#00288e]" />
                          <span>{order.deliveryAddress}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {meta && (
          <div className="bg-white rounded-lg border border-[#c4c5d5]/40 shadow-sm">
            <Pagination meta={meta} onPageChange={setPage} />
          </div>
        )}
      </div>

      {returnTarget && (
        <div className="fixed inset-0 bg-[#0b1c30]/40 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-[400px] bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="px-6 pt-6 pb-4 flex items-start justify-between">
              <h2 className="text-lg font-semibold text-[#0b1c30]">Return Item</h2>
              <button
                onClick={() => setReturnTarget(null)}
                className="text-[#444653] hover:text-[#0b1c30] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 pb-6 flex flex-col gap-4">
              <p className="text-sm text-[#444653]">
                Returning <span className="font-semibold text-[#0b1c30]">{returnTarget.item.product?.name}</span>{' '}
                from order #ORD-{returnTarget.order.id}.
              </p>
              {returnError && (
                <div className="p-3 rounded-lg bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] text-sm">
                  {returnError}
                </div>
              )}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#0b1c30]">
                  Quantity to return (max {returnTarget.item.quantity - returnTarget.item.returnedQuantity})
                </label>
                <input
                  type="number"
                  min={1}
                  max={returnTarget.item.quantity - returnTarget.item.returnedQuantity}
                  value={returnQuantity}
                  onChange={(e) => setReturnQuantity(Number(e.target.value))}
                  className="h-9 px-3 bg-white border border-[#c4c5d5] rounded text-sm text-[#0b1c30] focus:outline-none focus:border-[#00288e] focus:ring-2 focus:ring-[#00288e]/15"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReturnTarget(null)}
                  className="h-9 px-4 rounded-lg border border-[#c4c5d5] text-[#0b1c30] text-sm hover:bg-[#eff4ff] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReturn}
                  disabled={returning}
                  className="h-9 px-4 rounded-lg bg-[#ba1a1a] hover:opacity-90 disabled:opacity-50 text-white text-sm font-medium flex items-center gap-2 transition-opacity cursor-pointer"
                >
                  {returning && <Loader2 className="w-4 h-4 animate-spin" />}
                  Confirm Return
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
