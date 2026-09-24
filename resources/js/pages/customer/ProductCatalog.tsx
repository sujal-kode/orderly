import React, { useEffect, useState } from 'react'
import { Package, ShoppingCart, Plus, Minus, Check, Loader2, Tag } from 'lucide-react'
import { Pagination } from '../../components/Pagination.js'
import { SearchInput } from '../../components/SearchInput.js'
import { api, type Product, type ProductDiscount, type PaginationMeta } from '../../services/api.js'
import { useToast } from '../../context/ToastContext.js'
import { useCart } from '../../context/CartContext.js'

interface ProductCatalogProps {
  navigate: (path: string) => void
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ navigate }) => {
  const { showToast } = useToast()
  const { refreshCartCount } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [discountsByProduct, setDiscountsByProduct] = useState<Record<number, ProductDiscount>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [addingId, setAddingId] = useState<number | null>(null)
  const [addedId, setAddedId] = useState<number | null>(null)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const productsData = await api.customer.products.list({
          page,
          perPage: 9,
          search: debouncedSearch || undefined,
        })
        setProducts(productsData.data)
        setMeta(productsData.meta)
        // Best-effort: surface volume-discount hints if this account can read them (admin-only endpoint).
        try {
          const discounts = await api.admin.productDiscounts.list({ page: 1, perPage: 100 })
          const byProduct: Record<number, ProductDiscount> = {}
          for (const d of discounts.data) {
            if (!d.isActive) continue
            const existing = byProduct[d.productId]
            if (!existing || Number(d.discountPercentage) > Number(existing.discountPercentage)) {
              byProduct[d.productId] = d
            }
          }
          setDiscountsByProduct(byProduct)
        } catch {
          // Non-admin accounts can't read this; the catalog still works without the hint.
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load products.')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [page, debouncedSearch])

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(search), 350)
    return () => clearTimeout(handle)
  }, [search])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  const getQty = (id: number) => quantities[id] ?? 1
  const setQty = (id: number, qty: number) => setQuantities((q) => ({ ...q, [id]: Math.max(1, qty) }))

  const handleAddToCart = async (product: Product) => {
    setAddingId(product.id)
    setError(null)
    try {
      await api.customer.cart.add({ productId: product.id, quantity: getQty(product.id) })
      setAddedId(product.id)
      await refreshCartCount()
      setTimeout(() => setAddedId(null), 1500)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to add to cart.'
      setError(message)
      showToast(message, 'error')
    } finally {
      setAddingId(null)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-[#f8f9ff] px-4 md:px-6 py-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#0b1c30] tracking-tight">Products</h1>
            <p className="text-sm text-[#444653] mt-0.5">
              Browse products available from our stores.
            </p>
          </div>
          <button
            onClick={() => navigate('/app/cart')}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-md bg-[#1e40af] hover:bg-[#00288e] text-white text-sm font-medium transition-colors shadow-sm cursor-pointer self-start"
          >
            <ShoppingCart className="w-4 h-4" />
            View Cart
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] text-sm">
            {error}
          </div>
        )}

        <SearchInput value={search} onChange={setSearch} placeholder="Search products…" className="max-w-sm" />

        {isLoading ? (
          <div className="text-sm text-[#444653]">Loading products…</div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#c4c5d5]/40 p-12 text-center text-sm text-[#444653]">
            No products {search ? 'match your search.' : 'available right now.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => {
              const discount = discountsByProduct[product.id]
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-lg border border-[#c4c5d5]/40 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
                >
                  <div className="relative h-40 bg-[#eff4ff] flex items-center justify-center">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-8 h-8 text-[#00288e]" />
                    )}
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      In Stock
                    </span>
                  </div>
                  <div className="p-4 flex flex-col gap-1 flex-1">
                    <h3 className="text-sm font-semibold text-[#0b1c30] leading-tight">{product.name}</h3>
                    {product.description && (
                      <p className="text-xs text-[#444653] line-clamp-2">{product.description}</p>
                    )}
                    {discount && (
                      <div className="mt-1 inline-flex items-center gap-1 self-start px-2 py-0.5 rounded bg-[#eff4ff] text-[#00288e] text-xs font-medium">
                        <Tag className="w-3 h-3" />
                        Buy {discount.minQuantity}+ and get {discount.discountPercentage}% OFF
                      </div>
                    )}
                    <div className="mt-auto pt-3 border-t border-[#c4c5d5]/30 flex items-center justify-between">
                      <span className="text-xs text-[#444653]">Price</span>
                      <span className="text-lg font-bold text-[#0b1c30] tabular-nums">
                        ₹{Number(product.price).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <div className="flex items-center border border-[#c4c5d5] rounded-md">
                        <button
                          onClick={() => setQty(product.id, getQty(product.id) - 1)}
                          className="p-1.5 text-[#444653] hover:text-[#0b1c30] cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm text-[#0b1c30] tabular-nums">
                          {getQty(product.id)}
                        </span>
                        <button
                          onClick={() => setQty(product.id, getQty(product.id) + 1)}
                          className="p-1.5 text-[#444653] hover:text-[#0b1c30] cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={addingId === product.id}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 rounded-md bg-[#1e40af] hover:bg-[#00288e] disabled:opacity-60 text-white text-sm font-medium transition-colors cursor-pointer"
                      >
                        {addingId === product.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : addedId === product.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Added
                          </>
                        ) : (
                          'Add to Cart'
                        )}
                      </button>
                    </div>
                  </div>
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

        <div className="bg-[#eff4ff] rounded-lg p-5 border border-[#c4c5d5]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#dae2fd] flex items-center justify-center text-[#00288e] shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0b1c30]">Multi-Store Smart Fulfillment</p>
              <p className="text-sm text-[#444653]">
                Items in your cart are automatically sourced from the nearest available store branches.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
