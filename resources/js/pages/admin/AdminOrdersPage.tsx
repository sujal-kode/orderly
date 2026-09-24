import React, { useEffect, useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { AdminLayout } from '../../components/AdminLayout.js'
import { Pagination } from '../../components/Pagination.js'
import { SearchInput } from '../../components/SearchInput.js'
import { useToast } from '../../context/ToastContext.js'
import { api, type Order, type OrderStatus, type PaginationMeta } from '../../services/api.js'

interface AdminOrdersPageProps {
  navigate: (path: string) => void
}

const STATUS_STYLES: Record<OrderStatus, string> = {
  placed: 'bg-blue-50 text-blue-700 border-blue-200',
  processing: 'bg-amber-50 text-amber-700 border-amber-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
  returned: 'bg-purple-50 text-purple-700 border-purple-200',
}

const STATUSES: OrderStatus[] = ['placed', 'processing', 'completed', 'cancelled']

export const AdminOrdersPage: React.FC<AdminOrdersPageProps> = ({ navigate }) => {
  const { showToast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Order | null>(null)
  const [updating, setUpdating] = useState(false)

  const load = async (targetPage = page, targetSearch = debouncedSearch) => {
    setIsLoading(true)
    try {
      const res = await api.admin.orders.list({ page: targetPage, perPage: 10, search: targetSearch || undefined })
      setOrders(res.data)
      setMeta(res.meta)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load orders.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(search), 350)
    return () => clearTimeout(handle)
  }, [search])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  useEffect(() => {
    load(page, debouncedSearch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch])

  const updateStatus = async (status: OrderStatus) => {
    if (!selected) return
    setUpdating(true)
    try {
      const updated = await api.admin.orders.updateStatus(selected.id, status)
      setSelected(updated)
      showToast(`Order status updated to "${status}".`)
      await load()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update order status.'
      setError(message)
      showToast(message, 'error')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <AdminLayout currentPath="/admin/orders" navigate={navigate}>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0b1c30] tracking-tight">Orders</h1>
          <p className="text-sm text-[#444653] mt-0.5">View and manage customer orders across all stores.</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] text-sm">
            {error}
          </div>
        )}

        <SearchInput value={search} onChange={setSearch} placeholder="Search by order ID or customer name/email…" className="max-w-sm" />

        <div className="bg-white rounded-lg border border-[#c4c5d5]/40 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[820px]">
              <thead>
                <tr className="bg-[#eff4ff] border-b border-[#c4c5d5]/30 text-xs text-[#444653] uppercase tracking-wider">
                  <th className="px-5 py-2.5 font-semibold">Order</th>
                  <th className="px-4 py-2.5 font-semibold">Customer</th>
                  <th className="px-4 py-2.5 font-semibold">Items</th>
                  <th className="px-4 py-2.5 font-semibold text-right">Total</th>
                  <th className="px-4 py-2.5 font-semibold">Status</th>
                  <th className="px-4 py-2.5 font-semibold">Date</th>
                  <th className="px-5 py-2.5 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c4c5d5]/20 text-sm text-[#0b1c30]">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-8 px-5 text-center text-[#444653]">
                      Loading orders…
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 px-5 text-center text-[#444653]">
                      No orders placed yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#eff4ff]/40 transition-colors">
                      <td className="px-5 py-3 font-semibold text-[#00288e]">#ORD-{order.id}</td>
                      <td className="px-4 py-3 font-medium">{order.user?.fullName || order.user?.email || '—'}</td>
                      <td className="px-4 py-3 text-[#444653] tabular-nums">{order.items?.length ?? 0} items</td>
                      <td className="px-4 py-3 text-right font-medium tabular-nums">
                        ₹{Number(order.total).toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border capitalize ${STATUS_STYLES[order.status]}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#444653]">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <button
                          onClick={() => setSelected(order)}
                          className="inline-flex items-center justify-center px-2.5 py-1 rounded border border-[#c4c5d5] bg-white hover:bg-[#eff4ff] text-[#0b1c30] text-xs font-medium transition-colors cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {meta && <Pagination meta={meta} onPageChange={setPage} />}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-[#0b1c30]/40 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-[620px] max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl">
            <div className="px-6 pt-6 pb-4 flex items-start justify-between border-b border-[#c4c5d5]/30">
              <div>
                <h2 className="text-lg font-semibold text-[#0b1c30]">Order #ORD-{selected.id}</h2>
                <p className="text-sm text-[#444653] mt-0.5">
                  {selected.user?.fullName || selected.user?.email} •{' '}
                  {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : ''}
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="text-[#444653] hover:text-[#0b1c30] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#444653]">Items</span>
                <div className="mt-2 flex flex-col gap-2">
                  {selected.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-[#c4c5d5]/40"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[#0b1c30]">{item.product?.name}</span>
                        <span className="text-xs text-[#444653]">
                          {item.store?.name} • Qty {item.quantity} × ₹{Number(item.unitPrice).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-[#0b1c30] tabular-nums">
                        ₹{Number(item.totalPrice).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 p-4 rounded-lg bg-[#eff4ff]">
                <div className="flex items-center justify-between text-sm text-[#444653]">
                  <span>Subtotal</span>
                  <span className="tabular-nums">₹{Number(selected.subtotal).toLocaleString('en-IN')}</span>
                </div>
                {Number(selected.productDiscountAmount) > 0 && (
                  <div className="flex items-center justify-between text-sm text-emerald-700">
                    <span>Product Discount</span>
                    <span className="tabular-nums">
                      -₹{Number(selected.productDiscountAmount).toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                {Number(selected.platformDiscountAmount) > 0 && (
                  <div className="flex items-center justify-between text-sm text-emerald-700">
                    <span>Platform Discount</span>
                    <span className="tabular-nums">
                      -₹{Number(selected.platformDiscountAmount).toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-base font-bold text-[#0b1c30] pt-1.5 border-t border-[#c4c5d5]/40">
                  <span>Total</span>
                  <span className="tabular-nums">₹{Number(selected.total).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#444653]">Update Status</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {STATUSES.map((status) => (
                    <button
                      key={status}
                      disabled={updating || selected.status === status}
                      onClick={() => updateStatus(status)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border capitalize transition-colors cursor-pointer disabled:cursor-default ${
                        selected.status === status
                          ? `${STATUS_STYLES[status]} font-semibold`
                          : 'border-[#c4c5d5] text-[#0b1c30] hover:bg-[#eff4ff]'
                      }`}
                    >
                      {updating && selected.status !== status && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
