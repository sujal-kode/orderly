import type { TransactionClientContract } from '@adonisjs/lucid/types/database'
import StoreInventory from '#models/store_inventory'
import InsufficientInventoryException from '#exceptions/insufficient_inventory_exception'

export interface StoreAllocation {
  storeId: number
  quantity: number
}

export interface InventoryAllocationRequest {
  productId: number
  quantity: number
}

export interface CustomerLocation {
  latitude: number
  longitude: number
}

/**
 * Great-circle distance between two lat/lng points in kilometers (Haversine formula).
 */
function distanceKm(a: CustomerLocation, b: CustomerLocation): number {
  const EARTH_RADIUS_KM = 6371
  const toRad = (deg: number) => (deg * Math.PI) / 180

  const dLat = toRad(b.latitude - a.latitude)
  const dLng = toRad(b.longitude - a.longitude)
  const lat1 = toRad(a.latitude)
  const lat2 = toRad(b.latitude)

  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))

  return EARTH_RADIUS_KM * c
}

/**
 * Allocates cart items across store inventories.
 *
 * When the customer's location is known, candidate stores are ranked by
 * distance (nearest first) and the nearest store that alone can satisfy
 * the full quantity is used. When no single nearby store has enough stock,
 * falls back to a greedy multi-store split, nearest stores first.
 *
 * When location is unknown, ranks by available quantity (highest first)
 * instead, preserving the original behavior.
 */
export default class InventoryService {
  static async allocate(
    items: InventoryAllocationRequest[],
    trx: TransactionClientContract,
    customerLocation?: CustomerLocation | null
  ): Promise<Map<number, StoreAllocation[]>> {
    const allocations = new Map<number, StoreAllocation[]>()

    for (const item of items) {
      const inventories = await StoreInventory.query({ client: trx })
        .where('productId', item.productId)
        .where('quantity', '>', 0)
        .preload('store')
        .forUpdate()

      const ranked = [...inventories].sort((a, b) => {
        if (customerLocation && a.store.latitude != null && a.store.longitude != null && b.store.latitude != null && b.store.longitude != null) {
          const distA = distanceKm(customerLocation, { latitude: a.store.latitude, longitude: a.store.longitude })
          const distB = distanceKm(customerLocation, { latitude: b.store.latitude, longitude: b.store.longitude })
          return distA - distB
        }
        return b.quantity - a.quantity
      })

      const singleStore = ranked.find((inventory) => inventory.quantity >= item.quantity)

      if (singleStore) {
        allocations.set(item.productId, [
          { storeId: singleStore.storeId, quantity: item.quantity },
        ])
        continue
      }

      const totalAvailable = ranked.reduce((sum, inventory) => sum + inventory.quantity, 0)

      if (totalAvailable < item.quantity) {
        throw new InsufficientInventoryException(
          `Insufficient inventory for product ${item.productId}: requested ${item.quantity}, available ${totalAvailable}`,
          item.productId
        )
      }

      const split: StoreAllocation[] = []
      let remaining = item.quantity

      for (const inventory of ranked) {
        if (remaining <= 0) break
        const take = Math.min(inventory.quantity, remaining)
        split.push({ storeId: inventory.storeId, quantity: take })
        remaining -= take
      }

      allocations.set(item.productId, split)
    }

    return allocations
  }

  static async deduct(
    allocations: Map<number, StoreAllocation[]>,
    trx: TransactionClientContract
  ) {
    for (const [productId, stores] of allocations) {
      for (const allocation of stores) {
        const inventory = await StoreInventory.query({ client: trx })
          .where('productId', productId)
          .where('storeId', allocation.storeId)
          .firstOrFail()

        inventory.useTransaction(trx)
        inventory.quantity -= allocation.quantity
        await inventory.save()
      }
    }
  }

  /**
   * Restores previously deducted stock to a specific store — used when a
   * customer returns items. Unlike deduct(), this targets a single known
   * store (the one that originally fulfilled the item) rather than an
   * allocation map, since returns always go back to their source store.
   */
  static async restore(
    productId: number,
    storeId: number,
    quantity: number,
    trx: TransactionClientContract
  ) {
    const inventory = await StoreInventory.query({ client: trx })
      .where('productId', productId)
      .where('storeId', storeId)
      .firstOrFail()

    inventory.useTransaction(trx)
    inventory.quantity += quantity
    await inventory.save()
  }
}
