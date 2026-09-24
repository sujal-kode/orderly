import React, { useEffect, useState } from 'react'
import { Store, Package, ShoppingCart, AlertTriangle, ArrowRight } from 'lucide-react'
import { AdminLayout } from '../../components/AdminLayout.js'
import { api, type Store as StoreType, type Product, type Order, type InventoryItem } from '../../services/api.js'

interface AdminDashboardProps {
  navigate: (path: string) => void
}

const STATUS_STYLES: Record<string, string> = {
  placed: 'bg-blue-50 text-blue-700 border-blue-200',
  processing: 'bg-amber-50 text-amber-700 border-amber-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigate }) => {
  const [stores, setStores] = useState<StoreType[]>([])
  const [storeCount, setStoreCount] = useState(0)
  const [products, setProducts] = useState<Product[]>([])
  const [productCount, setProductCount] = useState(0)
  const [orders, setOrders] = useState<Order[]>([])
  const [orderCount, setOrderCount] = useState(0)
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [storesData, productsData, ordersData, inventoryData] = await Promise.all([
          api.admin.stores.list({ page: 1, perPage: 100 }),
          api.admin.products.list({ page: 1, perPage: 100 }),
          api.admin.orders.list({ page: 1, perPage: 50 }),
          api.admin.inventory.list({ page: 1, perPage: 100 }),
        ])
        setStores(storesData.data)
        setStoreCount(storesData.meta.total)
        setProducts(productsData.data)
        setProductCount(productsData.meta.total)
        setOrders(ordersData.data)
        setOrderCount(ordersData.meta.total)
        setInventory(inventoryData.data)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data.')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0)
  const lowStock = inventory.filter((i) => i.quantity > 0 && i.quantity <= 5)
  const outOfStock = inventory.filter((i) => i.quantity === 0)
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 5)

  if (isLoading) {
    return (
      <AdminLayout currentPath="/admin" navigate={navigate}>
        <div className="text-sm text-[#444653]">Loading dashboard…</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout currentPath="/admin" navigate={navigate}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#0b1c30] tracking-tight">Overview</h1>
            <p className="text-sm text-[#444653] mt-0.5">
              Real-time status across store outlets, inventory, and recent customer orders.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#e5eeff] border border-[#c4c5d5]/30 text-[#00288e] text-sm self-start">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>All systems normal</span>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-white border border-[#c4c5d5]/40 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#444653] font-medium">Total Stores</span>
              <div className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#00288e]">
                <Store className="w-[18px] h-[18px]" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-semibold text-[#0b1c30] tabular-nums">{storeCount}</div>
            <p className="mt-1 text-sm text-[#444653]">
              {stores.filter((s) => s.isActive).length} active locations
            </p>
          </div>

          <div className="bg-white border border-[#c4c5d5]/40 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#444653] font-medium">Total Products</span>
              <div className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#00288e]">
                <Package className="w-[18px] h-[18px]" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-semibold text-[#0b1c30] tabular-nums">{productCount}</div>
            <p className="mt-1 text-sm text-[#444653]">
              {products.filter((p) => p.isActive).length} active in catalog
            </p>
          </div>

          <div className="bg-white border border-[#c4c5d5]/40 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#444653] font-medium">Total Orders</span>
              <div className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#00288e]">
                <ShoppingCart className="w-[18px] h-[18px]" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-semibold text-[#0b1c30] tabular-nums">{orderCount}</div>
            <p className="mt-1 text-sm text-[#444653]">₹{totalRevenue.toLocaleString('en-IN')} total revenue</p>
          </div>

          <div className="bg-white border border-[#c4c5d5]/40 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#444653] font-medium">Low / Out of Stock</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
                <AlertTriangle className="w-[18px] h-[18px]" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-semibold text-[#0b1c30] tabular-nums">
              {lowStock.length + outOfStock.length}
            </div>
            <p className="mt-1 text-sm text-[#444653]">{outOfStock.length} out of stock</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-white border border-[#c4c5d5]/40 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#c4c5d5]/30 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-[#0b1c30]">Recent Orders</h2>
                <p className="text-sm text-[#444653]">Latest transactions across all active stores</p>
              </div>
              <button
                onClick={() => navigate('/admin/orders')}
                className="inline-flex items-center gap-1 text-[#00288e] hover:underline text-sm font-medium cursor-pointer"
              >
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#eff4ff] border-b border-[#c4c5d5]/30">
                    <th className="py-2.5 px-4 text-xs text-[#444653] font-semibold uppercase tracking-wider">
                      Order
                    </th>
                    <th className="py-2.5 px-4 text-xs text-[#444653] font-semibold uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="py-2.5 px-4 text-xs text-[#444653] font-semibold uppercase tracking-wider text-right">
                      Total
                    </th>
                    <th className="py-2.5 px-4 text-xs text-[#444653] font-semibold uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c4c5d5]/20 text-sm text-[#0b1c30]">
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 px-4 text-center text-[#444653]">
                        No orders yet.
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-[#eff4ff]/40 transition-colors">
                        <td className="py-3 px-4 font-semibold text-[#00288e]">#ORD-{order.id}</td>
                        <td className="py-3 px-4 font-medium">{order.user?.fullName || order.user?.email || '—'}</td>
                        <td className="py-3 px-4 text-right font-medium tabular-nums">
                          ₹{Number(order.total).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border capitalize ${STATUS_STYLES[order.status]}`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-[#c4c5d5]/40 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#c4c5d5]/30 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-[#0b1c30]">Low Stock Alert</h2>
                <p className="text-sm text-[#444653]">Items below reorder threshold</p>
              </div>
              <button
                onClick={() => navigate('/admin/inventory')}
                className="inline-flex items-center gap-1 text-[#00288e] hover:underline text-sm font-medium cursor-pointer"
              >
                Manage <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#eff4ff] border-b border-[#c4c5d5]/30">
                    <th className="py-2.5 px-4 text-xs text-[#444653] font-semibold uppercase tracking-wider">
                      Product
                    </th>
                    <th className="py-2.5 px-4 text-xs text-[#444653] font-semibold uppercase tracking-wider">
                      Store
                    </th>
                    <th className="py-2.5 px-4 text-xs text-[#444653] font-semibold uppercase tracking-wider text-center">
                      Qty
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c4c5d5]/20 text-sm text-[#0b1c30]">
                  {[...outOfStock, ...lowStock].length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-6 px-4 text-center text-[#444653]">
                        All stock levels healthy.
                      </td>
                    </tr>
                  ) : (
                    [...outOfStock, ...lowStock].slice(0, 6).map((item) => (
                      <tr key={item.id} className="hover:bg-[#eff4ff]/40 transition-colors">
                        <td className="py-3 px-4 font-medium">{item.product?.name}</td>
                        <td className="py-3 px-4 text-[#444653]">{item.store?.name}</td>
                        <td
                          className={`py-3 px-4 text-center font-semibold tabular-nums ${item.quantity === 0 ? 'text-[#ba1a1a]' : 'text-amber-700'}`}
                        >
                          {item.quantity}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
