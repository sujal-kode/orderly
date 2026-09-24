import React, { useEffect, useState } from 'react'
import { Plus, Trash2, X, Loader2 } from 'lucide-react'
import { AdminLayout } from '../../components/AdminLayout.js'
import { Pagination } from '../../components/Pagination.js'
import { FieldError, fieldInputClass } from '../../components/FieldError.js'
import { SearchInput } from '../../components/SearchInput.js'
import { useToast } from '../../context/ToastContext.js'
import {
  api,
  ApiError,
  type ProductDiscount,
  type PlatformDiscount,
  type Product,
  type PaginationMeta,
} from '../../services/api.js'

interface DiscountsPageProps {
  navigate: (path: string) => void
}

export const DiscountsPage: React.FC<DiscountsPageProps> = ({ navigate }) => {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<'product' | 'platform'>('product')
  const [productDiscounts, setProductDiscounts] = useState<ProductDiscount[]>([])
  const [productMeta, setProductMeta] = useState<PaginationMeta | null>(null)
  const [productPage, setProductPage] = useState(1)
  const [platformDiscounts, setPlatformDiscounts] = useState<PlatformDiscount[]>([])
  const [platformMeta, setPlatformMeta] = useState<PaginationMeta | null>(null)
  const [platformPage, setPlatformPage] = useState(1)
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [productModalOpen, setProductModalOpen] = useState(false)
  const [platformModalOpen, setPlatformModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [productForm, setProductForm] = useState({ productId: '', minQuantity: '', discountPercentage: '' })
  const [platformForm, setPlatformForm] = useState({ name: '', minOrderAmount: '', discountPercentage: '' })

  const load = async () => {
    setIsLoading(true)
    try {
      const [pd, pld, prods] = await Promise.all([
        api.admin.productDiscounts.list({ page: productPage, perPage: 10, search: debouncedSearch || undefined }),
        api.admin.platformDiscounts.list({ page: platformPage, perPage: 10, search: debouncedSearch || undefined }),
        api.admin.products.list({ page: 1, perPage: 100 }),
      ])
      setProductDiscounts(pd.data)
      setProductMeta(pd.meta)
      setPlatformDiscounts(pld.data)
      setPlatformMeta(pld.meta)
      setProducts(prods.data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load discounts.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(search), 350)
    return () => clearTimeout(handle)
  }, [search])

  useEffect(() => {
    setProductPage(1)
    setPlatformPage(1)
  }, [debouncedSearch])

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productPage, platformPage, debouncedSearch])

  const handleCreateProductDiscount = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setFieldErrors({})
    setSaving(true)
    try {
      await api.admin.productDiscounts.create({
        productId: Number(productForm.productId),
        minQuantity: Number(productForm.minQuantity),
        discountPercentage: Number(productForm.discountPercentage),
        isActive: true,
      })
      setProductModalOpen(false)
      setProductForm({ productId: '', minQuantity: '', discountPercentage: '' })
      showToast('Product discount created successfully.')
      await load()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create discount.'
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

  const handleCreatePlatformDiscount = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setFieldErrors({})
    setSaving(true)
    try {
      await api.admin.platformDiscounts.create({
        name: platformForm.name.trim(),
        minOrderAmount: Number(platformForm.minOrderAmount),
        discountPercentage: Number(platformForm.discountPercentage),
        isActive: true,
      })
      setPlatformModalOpen(false)
      setPlatformForm({ name: '', minOrderAmount: '', discountPercentage: '' })
      showToast('Platform discount created successfully.')
      await load()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create discount.'
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

  const deleteProductDiscount = async (id: number) => {
    try {
      await api.admin.productDiscounts.delete(id)
      showToast('Product discount deleted successfully.')
      await load()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete discount.'
      setError(message)
      showToast(message, 'error')
    }
  }

  const deletePlatformDiscount = async (id: number) => {
    try {
      await api.admin.platformDiscounts.delete(id)
      showToast('Platform discount deleted successfully.')
      await load()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete discount.'
      setError(message)
      showToast(message, 'error')
    }
  }

  return (
    <AdminLayout currentPath="/admin/discounts" navigate={navigate}>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0b1c30] tracking-tight">Discounts</h1>
          <p className="text-sm text-[#444653] mt-0.5">
            Product and platform discounts are mutually exclusive — the system applies whichever gives the customer
            the better deal.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] text-sm">
            {error}
          </div>
        )}

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={activeTab === 'product' ? 'Search by product name…' : 'Search by discount name…'}
          className="max-w-sm"
        />

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1 p-1 bg-[#eff4ff] rounded-lg">
              <button
                onClick={() => setActiveTab('product')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'product' ? 'bg-white text-[#00288e] shadow-sm' : 'text-[#444653] hover:text-[#0b1c30]'
                }`}
              >
                Product Discounts
              </button>
              <button
                onClick={() => setActiveTab('platform')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'platform' ? 'bg-white text-[#00288e] shadow-sm' : 'text-[#444653] hover:text-[#0b1c30]'
                }`}
              >
                Platform Discounts
              </button>
            </div>
            <button
              onClick={() => {
                setFormError(null)
                setFieldErrors({})
                if (activeTab === 'product') {
                  setProductModalOpen(true)
                } else {
                  setPlatformModalOpen(true)
                }
              }}
              className="inline-flex items-center gap-1.5 bg-[#1e40af] hover:bg-[#00288e] text-white text-sm font-medium px-3.5 py-1.5 rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          {activeTab === 'product' ? (
            <div className="bg-white rounded-lg border border-[#c4c5d5]/40 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#eff4ff] border-b border-[#c4c5d5]/30 text-xs text-[#444653] uppercase tracking-wider">
                    <th className="px-5 py-2.5 font-semibold">Product</th>
                    <th className="px-4 py-2.5 font-semibold text-right">Min Quantity</th>
                    <th className="px-4 py-2.5 font-semibold text-right">Discount</th>
                    <th className="px-5 py-2.5 font-semibold text-right w-20">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c4c5d5]/20 text-sm text-[#0b1c30]">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="py-6 px-5 text-center text-[#444653]">
                        Loading…
                      </td>
                    </tr>
                  ) : productDiscounts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 px-5 text-center text-[#444653]">
                        No product discounts yet.
                      </td>
                    </tr>
                  ) : (
                    productDiscounts.map((d) => (
                      <tr key={d.id} className="hover:bg-[#eff4ff]/40 transition-colors">
                        <td className="px-5 py-3 font-medium">{d.product?.name}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{d.minQuantity}+ units</td>
                        <td className="px-4 py-3 text-right font-semibold text-[#00288e] tabular-nums">
                          {d.discountPercentage}%
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button
                            onClick={() => deleteProductDiscount(d.id)}
                            className="p-1.5 text-[#444653] hover:text-[#ba1a1a] hover:bg-[#ffdad6] rounded transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {productMeta && <Pagination meta={productMeta} onPageChange={setProductPage} />}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-[#c4c5d5]/40 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#eff4ff] border-b border-[#c4c5d5]/30 text-xs text-[#444653] uppercase tracking-wider">
                    <th className="px-5 py-2.5 font-semibold">Name</th>
                    <th className="px-4 py-2.5 font-semibold text-right">Min Order Amount</th>
                    <th className="px-4 py-2.5 font-semibold text-right">Discount</th>
                    <th className="px-5 py-2.5 font-semibold text-right w-20">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c4c5d5]/20 text-sm text-[#0b1c30]">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="py-6 px-5 text-center text-[#444653]">
                        Loading…
                      </td>
                    </tr>
                  ) : platformDiscounts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 px-5 text-center text-[#444653]">
                        No platform discounts yet.
                      </td>
                    </tr>
                  ) : (
                    platformDiscounts.map((d) => (
                      <tr key={d.id} className="hover:bg-[#eff4ff]/40 transition-colors">
                        <td className="px-5 py-3 font-medium">{d.name}</td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          ₹{Number(d.minOrderAmount).toLocaleString('en-IN')}+
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-[#00288e] tabular-nums">
                          {d.discountPercentage}%
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button
                            onClick={() => deletePlatformDiscount(d.id)}
                            className="p-1.5 text-[#444653] hover:text-[#ba1a1a] hover:bg-[#ffdad6] rounded transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {platformMeta && <Pagination meta={platformMeta} onPageChange={setPlatformPage} />}
            </div>
          )}
        </div>
      </div>

      {productModalOpen && (
        <div className="fixed inset-0 bg-[#0b1c30]/40 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-[440px] bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="px-6 pt-6 pb-4 flex items-start justify-between">
              <h2 className="text-lg font-semibold text-[#0b1c30]">Add Product Discount</h2>
              <button onClick={() => setProductModalOpen(false)} className="text-[#444653] hover:text-[#0b1c30] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateProductDiscount} className="px-6 pb-6 flex flex-col gap-4">
              {formError && (
                <div className="p-3 rounded-lg bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] text-sm">
                  {formError}
                </div>
              )}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#0b1c30]">Product</label>
                <select
                  required
                  value={productForm.productId}
                  onChange={(e) => setProductForm({ ...productForm, productId: e.target.value })}
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
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#0b1c30]">Minimum Quantity</label>
                <input
                  required
                  type="number"
                  min="1"
                  step="1"
                  value={productForm.minQuantity}
                  onChange={(e) => setProductForm({ ...productForm, minQuantity: e.target.value })}
                  className={fieldInputClass(!!fieldErrors.minQuantity)}
                />
                <FieldError message={fieldErrors.minQuantity} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#0b1c30]">Discount Percentage</label>
                <input
                  required
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={productForm.discountPercentage}
                  onChange={(e) => setProductForm({ ...productForm, discountPercentage: e.target.value })}
                  className={fieldInputClass(!!fieldErrors.discountPercentage)}
                />
                <FieldError message={fieldErrors.discountPercentage} />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
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
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {platformModalOpen && (
        <div className="fixed inset-0 bg-[#0b1c30]/40 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-[440px] bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="px-6 pt-6 pb-4 flex items-start justify-between">
              <h2 className="text-lg font-semibold text-[#0b1c30]">Add Platform Discount</h2>
              <button onClick={() => setPlatformModalOpen(false)} className="text-[#444653] hover:text-[#0b1c30] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreatePlatformDiscount} className="px-6 pb-6 flex flex-col gap-4">
              {formError && (
                <div className="p-3 rounded-lg bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] text-sm">
                  {formError}
                </div>
              )}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#0b1c30]">Name</label>
                <input
                  required
                  value={platformForm.name}
                  onChange={(e) => setPlatformForm({ ...platformForm, name: e.target.value })}
                  placeholder="e.g. Big Order Discount"
                  className={fieldInputClass(!!fieldErrors.name)}
                />
                <FieldError message={fieldErrors.name} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#0b1c30]">Minimum Order Amount (₹)</label>
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={platformForm.minOrderAmount}
                  onChange={(e) => setPlatformForm({ ...platformForm, minOrderAmount: e.target.value })}
                  className={fieldInputClass(!!fieldErrors.minOrderAmount)}
                />
                <FieldError message={fieldErrors.minOrderAmount} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#0b1c30]">Discount Percentage</label>
                <input
                  required
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={platformForm.discountPercentage}
                  onChange={(e) => setPlatformForm({ ...platformForm, discountPercentage: e.target.value })}
                  className={fieldInputClass(!!fieldErrors.discountPercentage)}
                />
                <FieldError message={fieldErrors.discountPercentage} />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPlatformModalOpen(false)}
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
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
