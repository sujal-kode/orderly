import React, { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react'
import { AdminLayout } from '../../components/AdminLayout.js'
import { Pagination } from '../../components/Pagination.js'
import { FieldError, fieldInputClass } from '../../components/FieldError.js'
import { LocationPicker } from '../../components/LocationPicker.js'
import { SearchInput } from '../../components/SearchInput.js'
import { useToast } from '../../context/ToastContext.js'
import { api, ApiError, type Store, type PaginationMeta } from '../../services/api.js'

interface StoresPageProps {
  navigate: (path: string) => void
}

interface StoreFormState {
  name: string
  address: string
  latitude: string
  longitude: string
  isActive: boolean
}

const EMPTY_FORM: StoreFormState = { name: '', address: '', latitude: '', longitude: '', isActive: true }

export const StoresPage: React.FC<StoresPageProps> = ({ navigate }) => {
  const { showToast } = useToast()
  const [stores, setStores] = useState<Store[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<StoreFormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [deleteTarget, setDeleteTarget] = useState<Store | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [togglingId, setTogglingId] = useState<number | null>(null)

  const load = async (targetPage = page, targetSearch = debouncedSearch) => {
    setIsLoading(true)
    try {
      const res = await api.admin.stores.list({ page: targetPage, perPage: 10, search: targetSearch || undefined })
      setStores(res.data)
      setMeta(res.meta)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load stores.')
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

  const openCreate = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setFormError(null)
    setFieldErrors({})
    setModalOpen(true)
  }

  const openEdit = (store: Store) => {
    setEditingId(store.id)
    setForm({
      name: store.name,
      address: store.address,
      latitude: String(store.latitude),
      longitude: String(store.longitude),
      isActive: store.isActive,
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
        address: form.address.trim(),
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        isActive: form.isActive,
      }
      if (editingId) {
        await api.admin.stores.update(editingId, payload)
        showToast('Store updated successfully.')
      } else {
        await api.admin.stores.create(payload)
        showToast('Store created successfully.')
      }
      setModalOpen(false)
      await load()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save store.'
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

  const handleToggleActive = async (store: Store) => {
    setTogglingId(store.id)
    const nextActive = !store.isActive
    setStores((prev) => prev.map((s) => (s.id === store.id ? { ...s, isActive: nextActive } : s)))
    try {
      await api.admin.stores.update(store.id, { isActive: nextActive })
      showToast(`Store marked as ${nextActive ? 'active' : 'inactive'}.`)
    } catch (err: unknown) {
      setStores((prev) => prev.map((s) => (s.id === store.id ? { ...s, isActive: store.isActive } : s)))
      const message = err instanceof Error ? err.message : 'Failed to update store status.'
      showToast(message, 'error')
    } finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await api.admin.stores.delete(deleteTarget.id)
      setDeleteTarget(null)
      showToast('Store deleted successfully.')
      await load()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete store.'
      setError(message)
      showToast(message, 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AdminLayout currentPath="/admin/stores" navigate={navigate}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#0b1c30] tracking-tight">Stores</h1>
            <p className="text-sm text-[#444653] mt-0.5">Manage store locations across the network.</p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-1.5 bg-[#1e40af] hover:bg-[#00288e] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Store</span>
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] text-sm">
            {error}
          </div>
        )}

        <SearchInput value={search} onChange={setSearch} placeholder="Search stores by name or address…" className="max-w-sm" />

        <div className="bg-white rounded-lg border border-[#c4c5d5]/40 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[720px]">
              <thead>
                <tr className="bg-[#eff4ff] border-b border-[#c4c5d5]/30 text-[#444653] text-xs uppercase tracking-wider">
                  <th className="py-2.5 px-5 font-semibold">Name</th>
                  <th className="py-2.5 px-5 font-semibold">Address</th>
                  <th className="py-2.5 px-5 font-semibold">Coordinates</th>
                  <th className="py-2.5 px-5 font-semibold">Status</th>
                  <th className="py-2.5 px-5 font-semibold text-center w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c4c5d5]/20 text-sm text-[#0b1c30]">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-8 px-5 text-center text-[#444653]">
                      Loading stores…
                    </td>
                  </tr>
                ) : stores.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 px-5 text-center text-[#444653]">
                      No stores yet. Add your first store to get started.
                    </td>
                  </tr>
                ) : (
                  stores.map((store) => (
                    <tr key={store.id} className="hover:bg-[#eff4ff]/40 transition-colors">
                      <td className="py-3 px-5 font-semibold">{store.name}</td>
                      <td className="py-3 px-5 text-[#444653]">{store.address}</td>
                      <td className="py-3 px-5 text-[#444653] tabular-nums text-xs">
                        {store.latitude}, {store.longitude}
                      </td>
                      <td className="py-3 px-5">
                        <button
                          onClick={() => handleToggleActive(store)}
                          disabled={togglingId === store.id}
                          role="switch"
                          aria-checked={store.isActive}
                          title={store.isActive ? 'Click to deactivate' : 'Click to activate'}
                          className={`inline-flex items-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                            togglingId === store.id ? 'opacity-60' : ''
                          }`}
                        >
                          <span
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                              store.isActive ? 'bg-emerald-500' : 'bg-[#c4c5d5]'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                store.isActive ? 'translate-x-4' : 'translate-x-0.5'
                              }`}
                            />
                          </span>
                          <span
                            className={`text-xs font-semibold ${
                              store.isActive ? 'text-emerald-700' : 'text-[#334155]'
                            }`}
                          >
                            {store.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </button>
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex items-center justify-center gap-1 text-[#444653]">
                          <button
                            onClick={() => openEdit(store)}
                            className="p-1.5 hover:text-[#00288e] hover:bg-[#eff4ff] rounded transition-colors cursor-pointer"
                            title="Edit store"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(store)}
                            className="p-1.5 hover:text-[#ba1a1a] hover:bg-[#ffdad6] rounded transition-colors cursor-pointer"
                            title="Delete store"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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

      {modalOpen && (
        <div className="fixed inset-0 bg-[#0b1c30]/40 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-[560px] max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="px-6 pt-6 pb-4 flex items-start justify-between">
              <h2 className="text-lg font-semibold text-[#0b1c30]">{editingId ? 'Edit Store' : 'Add Store'}</h2>
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
                <label className="text-sm font-medium text-[#0b1c30]">Address</label>
                <input
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className={fieldInputClass(!!fieldErrors.address)}
                />
                <FieldError message={fieldErrors.address} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#0b1c30]">Store Location</label>
                <LocationPicker
                  latitude={form.latitude ? Number(form.latitude) : null}
                  longitude={form.longitude ? Number(form.longitude) : null}
                  onChange={(lat, lng) =>
                    setForm((f) => ({ ...f, latitude: String(lat), longitude: String(lng) }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-[#0b1c30]">Latitude</label>
                  <input
                    required
                    type="number"
                    step="any"
                    value={form.latitude}
                    onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                    className={fieldInputClass(!!fieldErrors.latitude)}
                  />
                  <FieldError message={fieldErrors.latitude} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-[#0b1c30]">Longitude</label>
                  <input
                    required
                    type="number"
                    step="any"
                    value={form.longitude}
                    onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                    className={fieldInputClass(!!fieldErrors.longitude)}
                  />
                  <FieldError message={fieldErrors.longitude} />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, isActive: !form.isActive })}
                role="switch"
                aria-checked={form.isActive}
                className="inline-flex items-center gap-2 cursor-pointer self-start"
              >
                <span
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    form.isActive ? 'bg-emerald-500' : 'bg-[#c4c5d5]'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      form.isActive ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </span>
                <span className="text-sm text-[#0b1c30]">Active</span>
              </button>
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
                  {editingId ? 'Save Changes' : 'Create Store'}
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
              This will permanently remove this store and its inventory records. This action cannot be undone.
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
