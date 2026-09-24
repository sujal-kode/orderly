import React, { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Loader2, Package } from 'lucide-react'
import { AdminLayout } from '../../components/AdminLayout.js'
import { Pagination } from '../../components/Pagination.js'
import { FieldError, fieldInputClass } from '../../components/FieldError.js'
import { SearchInput } from '../../components/SearchInput.js'
import { useToast } from '../../context/ToastContext.js'
import { api, ApiError, type Product, type PaginationMeta } from '../../services/api.js'

interface ProductsPageProps {
  navigate: (path: string) => void
}

interface ProductFormState {
  name: string
  description: string
  price: string
  imageUrl: string
  isActive: boolean
}

const EMPTY_FORM: ProductFormState = { name: '', description: '', price: '', imageUrl: '', isActive: true }

export const ProductsPage: React.FC<ProductsPageProps> = ({ navigate }) => {
  const { showToast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sort, setSort] = useState<'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'>('name-asc')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = async (targetPage = page, targetSearch = debouncedSearch) => {
    setIsLoading(true)
    try {
      const [sortBy, sortDir] = sort.split('-') as ['name' | 'price', 'asc' | 'desc']
      const res = await api.admin.products.list({
        page: targetPage,
        perPage: 9,
        search: targetSearch || undefined,
        sortBy,
        sortDir,
      })
      setProducts(res.data)
      setMeta(res.meta)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load products.')
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
  }, [debouncedSearch, sort])

  useEffect(() => {
    load(page, debouncedSearch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch, sort])

  const openCreate = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setFormError(null)
    setFieldErrors({})
    setModalOpen(true)
  }

  const openEdit = (product: Product) => {
    setEditingId(product.id)
    setForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      imageUrl: product.imageUrl || '',
      isActive: product.isActive,
    })
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
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        price: Number(form.price),
        imageUrl: form.imageUrl.trim() || undefined,
        isActive: form.isActive,
      }
      if (editingId) {
        await api.admin.products.update(editingId, payload)
        showToast('Product updated successfully.')
      } else {
        await api.admin.products.create(payload)
        showToast('Product created successfully.')
      }
      setModalOpen(false)
      await load()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save product.'
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

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await api.admin.products.delete(deleteTarget.id)
      setDeleteTarget(null)
      showToast('Product deleted successfully.')
      await load()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete product.'
      setError(message)
      showToast(message, 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AdminLayout currentPath="/admin/products" navigate={navigate}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#0b1c30] tracking-tight">Products</h1>
            <p className="text-sm text-[#444653] mt-0.5">Manage catalog items and pricing.</p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-1.5 bg-[#1e40af] hover:bg-[#00288e] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search products by name or description…" className="max-w-sm" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="h-9 px-3 bg-white border border-[#c4c5d5] rounded text-sm text-[#0b1c30] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00288e]/20"
          >
            <option value="name-asc">Name (A–Z)</option>
            <option value="name-desc">Name (Z–A)</option>
            <option value="price-asc">Price (Low–High)</option>
            <option value="price-desc">Price (High–Low)</option>
          </select>
        </div>

        {isLoading ? (
          <div className="text-sm text-[#444653]">Loading products…</div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#c4c5d5]/40 p-10 text-center text-sm text-[#444653]">
            No products yet. Add your first product to get started.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg border border-[#c4c5d5]/40 shadow-sm overflow-hidden flex flex-col"
              >
                <div className="h-36 bg-[#eff4ff] flex items-center justify-center">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-8 h-8 text-[#00288e]" />
                  )}
                </div>
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-[#0b1c30] leading-tight">{product.name}</h3>
                    <span
                      className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${
                        product.isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-[#f1f5f9] text-[#334155] border-[#e2e8f0]'
                      }`}
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {product.description && (
                    <p className="text-xs text-[#444653] line-clamp-2">{product.description}</p>
                  )}
                  <div className="mt-auto pt-2 flex items-center justify-between">
                    <span className="text-base font-bold text-[#0b1c30] tabular-nums">
                      ₹{Number(product.price).toLocaleString('en-IN')}
                    </span>
                    <div className="flex items-center gap-1 text-[#444653]">
                      <button
                        onClick={() => openEdit(product)}
                        className="p-1.5 hover:text-[#00288e] hover:bg-[#eff4ff] rounded transition-colors cursor-pointer"
                        title="Edit product"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(product)}
                        className="p-1.5 hover:text-[#ba1a1a] hover:bg-[#ffdad6] rounded transition-colors cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {meta && (
            <div className="bg-white rounded-lg border border-[#c4c5d5]/40 shadow-sm">
              <Pagination meta={meta} onPageChange={setPage} />
            </div>
          )}
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-[#0b1c30]/40 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-[480px] bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="px-6 pt-6 pb-4 flex items-start justify-between">
              <h2 className="text-lg font-semibold text-[#0b1c30]">{editingId ? 'Edit Product' : 'Add Product'}</h2>
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
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#0b1c30]">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={fieldInputClass(!!fieldErrors.name)}
                />
                <FieldError message={fieldErrors.name} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#0b1c30]">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={`px-3 py-2 resize-none ${fieldInputClass(!!fieldErrors.description)}`}
                />
                <FieldError message={fieldErrors.description} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#0b1c30]">Price (₹)</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className={fieldInputClass(!!fieldErrors.price)}
                />
                <FieldError message={fieldErrors.price} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#0b1c30]">Image URL</label>
                <input
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://…"
                  className={fieldInputClass(!!fieldErrors.imageUrl)}
                />
                <FieldError message={fieldErrors.imageUrl} />
              </div>
              <label className="flex items-center gap-2 text-sm text-[#0b1c30] cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 rounded accent-[#00288e]"
                />
                Active (visible to customers)
              </label>
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
                  {editingId ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-[#0b1c30]/40 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-[400px] bg-white rounded-xl shadow-xl p-6">
            <h2 className="text-lg font-semibold text-[#0b1c30]">Delete "{deleteTarget.name}"?</h2>
            <p className="text-sm text-[#444653] mt-2">
              This will permanently remove this product and its inventory records. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-5">
              <button
                onClick={() => setDeleteTarget(null)}
                className="h-9 px-4 rounded-lg border border-[#c4c5d5] text-[#0b1c30] text-sm hover:bg-[#eff4ff] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="h-9 px-4 rounded-lg bg-[#ba1a1a] hover:opacity-90 disabled:opacity-50 text-white text-sm font-medium flex items-center gap-2 transition-opacity cursor-pointer"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
