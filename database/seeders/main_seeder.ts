import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Store from '#models/store'
import Product from '#models/product'
import StoreInventory from '#models/store_inventory'
import ProductDiscount from '#models/product_discount'
import PlatformDiscount from '#models/platform_discount'

export default class extends BaseSeeder {
  async run() {
    await User.updateOrCreateMany('email', [
      {
        fullName: 'Admin',
        email: 'admin@gmail.com',
        password: 'password',
        role: 'admin',
      },
      {
        fullName: 'Jane Customer',
        email: 'customer@gmail.com',
        password: 'password',
        role: 'customer',
      },
    ])

    const stores = await Store.updateOrCreateMany('name', [
      {
        name: 'Tarsali Store',
        address: '12 Tarsali Main Road, Vadodara',
        latitude: 22.2836,
        longitude: 73.1584,
        isActive: true,
      },
      {
        name: 'Makarpura Store',
        address: '45 Makarpura Industrial Estate, Vadodara',
        latitude: 22.2495,
        longitude: 73.1897,
        isActive: true,
      },
      {
        name: 'Alkapuri Hub',
        address: '8 Alkapuri Society, Vadodara',
        latitude: 22.3115,
        longitude: 73.1631,
        isActive: true,
      },
    ])

    const products = await Product.updateOrCreateMany('name', [
      {
        name: 'Wireless Optical Mouse',
        description: 'Ergonomic 2.4GHz wireless mouse with adjustable DPI.',
        price: 850,
        imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
        isActive: true,
      },
      {
        name: 'Ultra High-Speed HDMI Cable (2m)',
        description: '4K/8K capable HDMI 2.1 cable, 2 meters.',
        price: 400,
        imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400',
        isActive: true,
      },
      {
        name: 'Full HD IPS Monitor 24"',
        description: '24-inch 1080p IPS monitor with slim bezels.',
        price: 6500,
        imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
        isActive: true,
      },
      {
        name: 'Mechanical Keyboard (Blue Switch)',
        description: 'Full-size mechanical keyboard with RGB backlighting.',
        price: 2200,
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
        isActive: true,
      },
      {
        name: 'Laptop Core i7',
        description: '15.6" laptop, 16GB RAM, 512GB SSD.',
        price: 65000,
        imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        isActive: true,
      },
      {
        name: 'USB-C Docking Station',
        description: '10-in-1 USB-C hub with HDMI, Ethernet, and SD card slots.',
        price: 3200,
        imageUrl: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400',
        isActive: true,
      },
      {
        name: 'Wireless Noise-Cancelling Headphones',
        description: 'Over-ear headphones with active noise cancellation, 30hr battery.',
        price: 8500,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        isActive: true,
      },
      {
        name: 'Portable SSD 1TB',
        description: 'USB 3.2 Gen 2 external SSD, up to 1050MB/s read speed.',
        price: 7200,
        imageUrl: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=400',
        isActive: true,
      },
      {
        name: 'Webcam 1080p',
        description: 'Full HD webcam with built-in dual microphones and privacy shutter.',
        price: 1800,
        imageUrl: 'https://images.unsplash.com/photo-1587826080692-f439465bef03?w=400',
        isActive: true,
      },
      {
        name: 'Gaming Mouse Pad (Extended)',
        description: 'Large stitched-edge desk mat, 900x400mm, non-slip base.',
        price: 650,
        imageUrl: 'https://images.unsplash.com/photo-1616071357079-c14c0f0f0b0c?w=400',
        isActive: true,
      },
      {
        name: 'Bluetooth Speaker (Portable)',
        description: 'Waterproof IPX7 speaker with 12hr playtime and deep bass.',
        price: 2400,
        imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
        isActive: true,
      },
      {
        name: 'Laptop Stand (Aluminum)',
        description: 'Adjustable ergonomic stand, foldable, fits 10-17" laptops.',
        price: 1500,
        imageUrl: 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=400',
        isActive: true,
      },
      {
        name: 'Wireless Charging Pad',
        description: '15W fast wireless charger, Qi-compatible, LED indicator.',
        price: 900,
        imageUrl: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?w=400',
        isActive: true,
      },
      {
        name: '27" 4K UHD Monitor',
        description: 'IPS panel, 4K UHD resolution, USB-C with 65W power delivery.',
        price: 28000,
        imageUrl: 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=400',
        isActive: true,
      },
      {
        name: 'Ergonomic Office Chair',
        description: 'Mesh back support, adjustable armrests and lumbar support.',
        price: 12500,
        imageUrl: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400',
        isActive: true,
      },
      {
        name: 'Smart LED Desk Lamp',
        description: 'Touch control, adjustable brightness and color temperature.',
        price: 1650,
        imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
        isActive: true,
      },
      {
        name: 'Ethernet Cable Cat 6 (5m)',
        description: 'High-speed gigabit networking cable, gold-plated connectors.',
        price: 350,
        imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400',
        isActive: true,
      },
      {
        name: 'Power Strip Surge Protector',
        description: '6-outlet surge protector with 2 USB charging ports.',
        price: 1100,
        imageUrl: 'https://images.unsplash.com/photo-1621570072077-b9c2acbcbd1a?w=400',
        isActive: true,
      },
      {
        name: 'Compact Router (Wi-Fi 6)',
        description: 'Dual-band Wi-Fi 6 router, up to 3000Mbps combined speed.',
        price: 6800,
        imageUrl: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=400',
        isActive: true,
      },
      {
        name: 'Graphics Tablet (Drawing)',
        description: '10x6 inch active area, 8192 pressure levels, battery-free pen.',
        price: 4200,
        imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400',
        isActive: true,
      },
      {
        name: 'Compact Label Printer',
        description: 'Bluetooth thermal label printer, no ink required.',
        price: 3400,
        imageUrl: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eabd?w=400',
        isActive: true,
      },
    ])

    const [
      mouse,
      hdmi,
      monitor,
      keyboard,
      laptop,
      dock,
      headphones,
      ssd,
      webcam,
      deskMat,
      speaker,
      laptopStand,
      wirelessCharger,
      monitor4k,
      officeChair,
      deskLamp,
      ethernetCable,
      surgeProtector,
      router,
      graphicsTablet,
      labelPrinter,
    ] = products
    const [tarsali, makarpura, alkapuri] = stores

    await StoreInventory.updateOrCreateMany(['storeId', 'productId'], [
      { storeId: tarsali.id, productId: mouse.id, quantity: 25 },
      { storeId: tarsali.id, productId: hdmi.id, quantity: 40 },
      { storeId: tarsali.id, productId: keyboard.id, quantity: 15 },
      { storeId: tarsali.id, productId: laptop.id, quantity: 8 },

      { storeId: makarpura.id, productId: monitor.id, quantity: 12 },
      { storeId: makarpura.id, productId: mouse.id, quantity: 10 },
      { storeId: makarpura.id, productId: dock.id, quantity: 18 },
      { storeId: makarpura.id, productId: laptop.id, quantity: 5 },

      { storeId: alkapuri.id, productId: keyboard.id, quantity: 20 },
      { storeId: alkapuri.id, productId: hdmi.id, quantity: 30 },
      { storeId: alkapuri.id, productId: dock.id, quantity: 9 },
      { storeId: alkapuri.id, productId: monitor.id, quantity: 6 },

      { storeId: tarsali.id, productId: headphones.id, quantity: 14 },
      { storeId: tarsali.id, productId: ssd.id, quantity: 20 },
      { storeId: tarsali.id, productId: webcam.id, quantity: 22 },
      { storeId: tarsali.id, productId: deskMat.id, quantity: 30 },
      { storeId: tarsali.id, productId: speaker.id, quantity: 16 },
      { storeId: tarsali.id, productId: monitor4k.id, quantity: 4 },

      { storeId: makarpura.id, productId: headphones.id, quantity: 9 },
      { storeId: makarpura.id, productId: laptopStand.id, quantity: 25 },
      { storeId: makarpura.id, productId: wirelessCharger.id, quantity: 35 },
      { storeId: makarpura.id, productId: officeChair.id, quantity: 6 },
      { storeId: makarpura.id, productId: deskLamp.id, quantity: 18 },
      { storeId: makarpura.id, productId: router.id, quantity: 11 },

      { storeId: alkapuri.id, productId: ssd.id, quantity: 13 },
      { storeId: alkapuri.id, productId: ethernetCable.id, quantity: 50 },
      { storeId: alkapuri.id, productId: surgeProtector.id, quantity: 27 },
      { storeId: alkapuri.id, productId: graphicsTablet.id, quantity: 7 },
      { storeId: alkapuri.id, productId: labelPrinter.id, quantity: 10 },
      { storeId: alkapuri.id, productId: officeChair.id, quantity: 3 },
    ])

    await ProductDiscount.updateOrCreateMany(['productId', 'minQuantity'], [
      { productId: mouse.id, minQuantity: 5, discountPercentage: 10, isActive: true },
      { productId: hdmi.id, minQuantity: 3, discountPercentage: 15, isActive: true },
      { productId: keyboard.id, minQuantity: 2, discountPercentage: 8, isActive: true },
    ])

    await PlatformDiscount.updateOrCreateMany('name', [
      { name: 'Big Order Discount', minOrderAmount: 5000, discountPercentage: 5, isActive: true },
      { name: 'Bulk Order Discount', minOrderAmount: 15000, discountPercentage: 12, isActive: true },
    ])
  }
}
