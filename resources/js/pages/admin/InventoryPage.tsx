import React, { useEffect, useState } from 'react'
import { Pencil, Loader2, X, Info } from 'lucide-react'
import { AdminLayout } from '../../components/AdminLayout.js'
import { Pagination } from '../../components/Pagination.js'
import { FieldError, fieldInputClass } from '../../components/FieldError.js'
import { SearchInput } from '../../components/SearchInput.js'
import { useToast } from '../../context/ToastContext.js'
import { api, ApiError, type InventoryItem, type Store, type Product, type PaginationMeta } from '../../services/api.js'

interface InventoryPageProps {
  navigate: (path: string) => void
}

export const InventoryPage: React.FC<InventoryPageProps> = ({ navigate }) => {
  const { showToast } = useToast()
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [stores, setStores] = useState<Store[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [selectedStoreId, setSelectedStoreId] = useState('')
  const [selectedProductId, setSelectedProductId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const load = async (targetPage = page, targetSearch = debouncedSearch) => {
    setIsLoading(true)
    try {
      const [inv, storesData, productsData] = await Promise.all([
        api.admin.inventory.list({ page: targetPage, perPage: 10, search: targetSearch || undefined }),
        api.admin.stores.list({ page: 1, perPage: 100 }),
        api.admin.products.list({ page: 1, perPage: 100 }),
      ])
      setInventory(inv.data)
      setMeta(inv.meta)
      setStores(storesData.data)
      setProducts(productsData.data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load inventory.')
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

  const openEdit = (item: InventoryItem) => {
    setEditingItem(item)
    setSelectedStoreId(String(item.storeId))
    setSelectedProductId(String(item.productId))
    setQuantity(String(item.quantity))
    setFormError(null)
    setFieldErrors({})
    setModalOpen(true)
  }

  const openCreate = () => {
    setEditingItem(null)
    setSelectedStoreId('')
    setSelectedProductId('')
    setQuantity('')
    setFormError(null)
    setFieldErrors({})
    setModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setFieldErrors({})
    setSaving(true)
    try {
      if (editingItem) {
        await api.admin.inventory.update(editingItem.id, { quantity: Number(quantity) })
        showToast('Inventory updated successfully.')
      } else {
        await api.admin.inventory.set({
          storeId: Number(selectedStoreId),
          productId: Number(selectedProductId),
          quantity: Number(quantity),
        })
        showToast('Inventory set successfully.')
      }
      setModalOpen(false)
      await load()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update inventory.'
      if (err instanceof ApiError && err.fieldErrors.length > 0) {
        const errors: Record<string, string> = {}
        for (const fe of err.fieldErrors) errors[fe.field] = fe.message
        setFieldErrors(errors)
      } else {
        setFormError(message)
      }
      showToast(message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const statusFor = (qty: number) => {
    if (qty === 0) return { label: 'Out of Stock', cls: 'bg-rose-50 text-rose-700 border-rose-200' }
    if (qty <= 5) return { label: 'Low Stock', cls: 'bg-amber-50 text-amber-700 border-amber-200' }
    return { label: 'In Stock', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
  }

  return (
    <AdminLayout currentPath="/admin/inventory" navigate={navigate}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#0b1c30] tracking-tight">Inventory</h1>
            <p className="text-sm text-[#444653] mt-0.5">
              Manage multi-location stock levels and branch availability.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-1.5 bg-[#1e40af] hover:bg-[#00288e] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <span>Update Stock</span>
          </button>
        </div>

        <div className="flex items-start gap-3 p-4 bg-[#eff4ff] rounded-lg">
          <Info className="w-5 h-5 text-[#00288e] shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[#0b1c30]">Multi-Store Inventory Rule</span>
            <span className="text-sm text-[#444653]">
              Inventory is managed separately for each store. The same product maintains independent stock counts
              across each physical retail branch.
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] text-sm">
            {error}
          </div>
        )}

        <SearchInput value={search} onChange={setSearch} placeholder="Search by product or store name…" className="max-w-sm" />

        <div className="bg-white rounded-xl border border-[#c4c5d5]/40 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#eff4ff] border-b border-[#c4c5d5]/30 text-xs text-[#444653] uppercase tracking-wider">
                  <th className="px-5 py-2.5 font-semibold">Product</th>
                  <th className="px-4 py-2.5 font-semibold">Store</th>
                  <th className="px-4 py-2.5 font-semibold text-right">Available Qty</th>
                  <th className="px-4 py-2.5 font-semibold">Status</th>
                  <th className="px-5 py-2.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c4c5d5]/20 text-sm text-[#0b1c30]">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-8 px-5 text-center text-[#444653]">
                      Loading inventory…
                    </td>
                  </tr>
                ) : inventory.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 px-5 text-center text-[#444653]">
                      No inventory records yet.
                    </td>
                  </tr>
                ) : (
                  inventory.map((item) => {
                    const status = statusFor(item.quantity)
                    return (
                      <tr key={item.id} className="hover:bg-[#eff4ff]/40 transition-colors">
                        <td className="px-5 py-3 font-medium">{item.product?.name}</td>
                        <td className="px-4 py-3 text-[#444653]">{item.store?.name}</td>
                        <td className="px-4 py-3 text-right tabular-nums font-semibold">{item.quantity}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${status.cls}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button
                            onClick={() => openEdit(item)}
                            className="p-1.5 text-[#444653] hover:text-[#00288e] hover:bg-[#eff4ff] rounded transition-colors cursor-pointer"
                            title="Adjust quantity"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
          {meta && <Pagination meta={meta} onPageChange={setPage} />}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-[#0b1c30]/40 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-[480px] bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="px-6 pt-6 pb-4 flex items-start justify-between">
              <h2 className="text-lg font-semibold text-[#0b1c30]">
                {editingItem ? 'Update Stock' : 'Set Store Inventory'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#444653] hover:text-[#0b1c30] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="px-6 pb-6 flex flex-col gap-4">
              {formError && (
                <div className="p-3 rounded-lg bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] text-sm">
                  {formError}
                </div>
              )}

              {editingItem ? (
                <>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-[#0b1c30]">Store</span>
                    <div className="h-9 px-3 bg-[#eff4ff] rounded flex items-center text-sm text-[#0b1c30]">
                      {editingItem.store?.name}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-[#0b1c30]">Product</span>
                    <div className="h-9 px-3 bg-[#eff4ff] rounded flex items-center text-sm text-[#0b1c30]">
                      {editingItem.product?.name}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#0b1c30]">Store</label>
                    <select
                      required
                      value={selectedStoreId}
                      onChange={(e) => setSelectedStoreId(e.target.value)}
                      className={fieldInputClass(!!fieldErrors.storeId)}
                    >
                      <option value="" disabled>
                        Select a store
                      </option>
                      {stores.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    <FieldError message={fieldErrors.storeId} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#0b1c30]">Product</label>
                    <select
                      required
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      className={fieldInputClass(!!fieldErrors.productId)}
                    >
                      <option value="" disabled>
                        Select a product
                      </option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <FieldError message={fieldErrors.productId} />
                  </div>
                </>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#0b1c30]">Quantity</label>
                <input
                  required
                  type="number"
                  min="0"
                  step="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className={fieldInputClass(!!fieldErrors.quantity)}
                />
                <FieldError message={fieldErrors.quantity} />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="h-9 px-4 rounded-lg border border-[#c4c5d5] text-[#0b1c30] text-sm hover:bg-[#eff4ff] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="h-9 px-4 rounded-lg bg-[#1e40af] hover:bg-[#00288e] disabled:opacity-50 text-white text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
