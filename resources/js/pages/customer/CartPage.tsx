import React, { useEffect, useState } from 'react'
import { Package, Minus, Plus, Trash2, Loader2, ShoppingBag, Tag, MapPin, LocateFixed, CheckCircle2 } from 'lucide-react'
import { api, type Cart } from '../../services/api.js'
import { useToast } from '../../context/ToastContext.js'
import { useCart } from '../../context/CartContext.js'
import { AddressAutocomplete } from '../../components/AddressAutocomplete.js'
import { LocationPicker } from '../../components/LocationPicker.js'

interface CartPageProps {
  navigate: (path: string) => void
}

export const CartPage: React.FC<CartPageProps> = ({ navigate }) => {
  const { showToast } = useToast()
  const { refreshCartCount } = useCart()
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [placing, setPlacing] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [addressError, setAddressError] = useState<string | null>(null)
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null)
  const [detecting, setDetecting] = useState(false)
  const [detectError, setDetectError] = useState<string | null>(null)

  const load = async () => {
    setIsLoading(true)
    try {
      setCart(await api.customer.cart.get())
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load cart.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleUpdateQty = async (itemId: number, quantity: number) => {
    setUpdatingId(itemId)
    setError(null)
    try {
      setCart(await api.customer.cart.updateItem(itemId, Math.max(0, quantity)))
      await refreshCartCount()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update item.')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleRemove = async (itemId: number) => {
    setUpdatingId(itemId)
    setError(null)
    try {
      await api.customer.cart.removeItem(itemId)
      showToast('Item removed from cart.')
      await refreshCartCount()
      await load()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to remove item.'
      setError(message)
      showToast(message, 'error')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDetectLocation = () => {
    setDetectError(null)

    if (!navigator.geolocation) {
      setDetectError('Geolocation is not supported by your browser.')
      return
    }

    setDetecting(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setCoords({ latitude, longitude })

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
            { headers: { Accept: 'application/json' } }
          )
          if (res.ok) {
            const data = await res.json()
            if (data?.display_name) {
              setDeliveryAddress(data.display_name)
              setAddressError(null)
            }
          }
          showToast('Location detected.')
        } catch {
          // Coordinates are still captured for store routing even if the address lookup fails.
          showToast('Location detected, but address lookup failed. Please enter your address manually.', 'error')
        } finally {
          setDetecting(false)
        }
      },
      (err) => {
        setDetecting(false)
        if (err.code === err.PERMISSION_DENIED) {
          setDetectError('Location access denied. You can still enter your address manually.')
        } else {
          setDetectError('Could not detect your location. Please enter your address manually.')
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleMapChange = async (lat: number, lng: number) => {
    setCoords({ latitude: lat, longitude: lng })
    setAddressError(null)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        { headers: { Accept: 'application/json' } }
      )
      if (res.ok) {
        const data = await res.json()
        if (data?.display_name) {
          setDeliveryAddress(data.display_name)
        }
      }
    } catch {
      // Coordinates are still captured for store routing even if the address lookup fails.
    }
  }

  const handlePlaceOrder = async () => {
    setAddressError(null)
    if (deliveryAddress.trim().length < 5) {
      setAddressError('Please enter a delivery address (at least 5 characters).')
      return
    }
    setPlacing(true)
    setError(null)
    try {
      const order = await api.customer.orders.place({
        deliveryAddress: deliveryAddress.trim(),
        ...(coords ? { latitude: coords.latitude, longitude: coords.longitude } : {}),
      })
      showToast('Order placed successfully!')
      await refreshCartCount()
      navigate(`/app/orders/${order.id}`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to place order. Please try again.'
      setError(message)
      showToast(message, 'error')
    } finally {
      setPlacing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] w-full bg-[#f8f9ff] flex items-center justify-center">
        <span className="text-sm text-[#444653]">Loading cart…</span>
      </div>
    )
  }

  const items = cart?.items ?? []

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-[#f8f9ff] px-4 md:px-6 py-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0b1c30] tracking-tight">Your Cart</h1>
          <p className="text-sm text-[#444653] mt-0.5">Review your items before placing the order.</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] text-sm">
            {error}
          </div>
        )}

        {items.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#c4c5d5]/40 p-12 text-center flex flex-col items-center gap-3">
            <ShoppingBag className="w-10 h-10 text-[#c4c5d5]" />
            <p className="text-sm text-[#444653]">Your cart is empty.</p>
            <button
              onClick={() => navigate('/app')}
              className="inline-flex items-center h-9 px-4 rounded-md bg-[#1e40af] hover:bg-[#00288e] text-white text-sm font-medium transition-colors cursor-pointer"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="bg-white rounded-lg border border-[#c4c5d5]/40 shadow-sm divide-y divide-[#c4c5d5]/20">
                {items.map((item) => (
                  <div key={item.id} className="p-4 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-lg bg-[#eff4ff] flex items-center justify-center shrink-0 overflow-hidden">
                      {item.product?.imageUrl ? (
                        <img src={item.product.imageUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-5 h-5 text-[#00288e]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0b1c30] truncate">{item.product?.name}</p>
                      <p className="text-sm text-[#444653] tabular-nums">
                        ₹{Number(item.product?.price ?? 0).toLocaleString('en-IN')} each
                      </p>
                    </div>
                    <div className="flex items-center border border-[#c4c5d5] rounded-md">
                      <button
                        disabled={updatingId === item.id}
                        onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                        className="p-1.5 text-[#444653] hover:text-[#0b1c30] cursor-pointer disabled:opacity-50"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm text-[#0b1c30] tabular-nums">
                        {updatingId === item.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" />
                        ) : (
                          item.quantity
                        )}
                      </span>
                      <button
                        disabled={updatingId === item.id}
                        onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                        className="p-1.5 text-[#444653] hover:text-[#0b1c30] cursor-pointer disabled:opacity-50"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="w-24 text-right text-sm font-semibold text-[#0b1c30] tabular-nums">
                      ₹{(Number(item.product?.price ?? 0) * item.quantity).toLocaleString('en-IN')}
                    </span>
                    <button
                      disabled={updatingId === item.id}
                      onClick={() => handleRemove(item.id)}
                      className="p-1.5 text-[#444653] hover:text-[#ba1a1a] hover:bg-[#ffdad6] rounded transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-lg border border-[#c4c5d5]/40 shadow-sm p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-[#eff4ff] flex items-center justify-center text-[#00288e]">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-[#0b1c30]">Delivery Address</h2>
                      <p className="text-xs text-[#444653]">Where should we deliver this order?</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={detecting}
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-[#c4c5d5] text-xs font-medium text-[#00288e] hover:bg-[#eff4ff] disabled:opacity-60 transition-colors cursor-pointer shrink-0"
                  >
                    {detecting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : coords ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <LocateFixed className="w-3.5 h-3.5" />
                    )}
                    {detecting ? 'Detecting…' : coords ? 'Location detected' : 'Detect my location'}
                  </button>
                </div>
                <AddressAutocomplete
                  value={deliveryAddress}
                  onChange={(value) => {
                    setDeliveryAddress(value)
                    if (addressError) setAddressError(null)
                  }}
                  onSelect={(address, lat, lon) => {
                    setDeliveryAddress(address)
                    setCoords({ latitude: lat, longitude: lon })
                    setAddressError(null)
                  }}
                  placeholder="Flat / House no., Street, Area, City, State, PIN code"
                  hasError={!!addressError}
                />
                {addressError && <p className="text-sm text-[#ba1a1a]">{addressError}</p>}
                {detectError && <p className="text-sm text-[#ba1a1a]">{detectError}</p>}
                {coords && !detectError && (
                  <p className="text-xs text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Using your precise location to find the nearest stores.
                  </p>
                )}
                <div className="pt-1 border-t border-[#c4c5d5]/30">
                  <p className="text-xs font-medium text-[#444653] mb-2">Or pick your location on the map</p>
                  <LocationPicker
                    latitude={coords?.latitude ?? null}
                    longitude={coords?.longitude ?? null}
                    onChange={handleMapChange}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#c4c5d5]/40 shadow-sm p-5 flex flex-col gap-3 sticky top-20">
              <h2 className="text-base font-semibold text-[#0b1c30]">Order Summary</h2>
              <div className="flex items-center justify-between text-sm text-[#444653]">
                <span>Subtotal</span>
                <span className="tabular-nums">₹{Number(cart?.subtotal ?? 0).toLocaleString('en-IN')}</span>
              </div>
              {cart?.discountType &&
                (() => {
                  const subtotal = Number(cart.subtotal)
                  const amount = Number(
                    cart.discountType === 'product' ? cart.productDiscountAmount : cart.platformDiscountAmount
                  )
                  const percent = subtotal > 0 ? (amount / subtotal) * 100 : 0
                  return (
                    <div className="flex items-center justify-between text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                      <span className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" />
                        {cart.discountType === 'product' ? 'Product Discount' : 'Platform Discount'}
                        <span className="text-xs font-semibold">({percent.toFixed(0)}% off)</span>
                      </span>
                      <span className="tabular-nums font-medium">-₹{amount.toLocaleString('en-IN')}</span>
                    </div>
                  )
                })()}
              <div className="flex items-center justify-between text-lg font-bold text-[#0b1c30] pt-2 border-t border-[#c4c5d5]/40">
                <span>Total</span>
                <span className="tabular-nums">₹{Number(cart?.total ?? 0).toLocaleString('en-IN')}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="w-full h-10 mt-2 bg-[#1e40af] hover:bg-[#00288e] disabled:opacity-60 text-white text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {placing && <Loader2 className="w-4 h-4 animate-spin" />}
                Place Order
              </button>
              <p className="text-xs text-[#444653] text-center">
                By placing this order, you confirm the delivery details are correct.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
