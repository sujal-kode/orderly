import React, { useState, useEffect } from 'react'
import { AuthProvider } from '../context/AuthContext.js'
import { ToastProvider } from '../context/ToastContext.js'
import { CartProvider, useCart } from '../context/CartContext.js'
import { Navbar } from './Navbar.js'
import { LandingPage } from './LandingPage.js'
import { LoginPage } from '../pages/LoginPage.js'
import { SignupPage } from '../pages/SignupPage.js'
import { AdminDashboard } from '../pages/admin/AdminDashboard.js'
import { StoresPage } from '../pages/admin/StoresPage.js'
import { ProductsPage } from '../pages/admin/ProductsPage.js'
import { InventoryPage } from '../pages/admin/InventoryPage.js'
import { DiscountsPage } from '../pages/admin/DiscountsPage.js'
import { AdminOrdersPage } from '../pages/admin/AdminOrdersPage.js'
import { ProductCatalog } from '../pages/customer/ProductCatalog.js'
import { CartPage } from '../pages/customer/CartPage.js'
import { OrdersPage } from '../pages/customer/OrdersPage.js'

export const AppContent: React.FC = () => {
  const { refreshCartCount } = useCart()
  const [currentPath, setCurrentPath] = useState<string>(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  )

  useEffect(() => {
    if (currentPath === '/app' || currentPath.startsWith('/app/')) {
      refreshCartCount()
    }
  }, [currentPath, refreshCartCount])

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path)
      setCurrentPath(path)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const isAdminRoute = currentPath === '/admin' || currentPath.startsWith('/admin/')

  const orderDetailMatch = currentPath.match(/^\/app\/orders\/(\d+)$/)

  useEffect(() => {
    const moduleNames: Record<string, string> = {
      '/': 'Home',
      '/login': 'Sign In',
      '/signup': 'Sign Up',
      '/dashboard': 'Dashboard',
      '/admin': 'Dashboard',
      '/admin/stores': 'Stores',
      '/admin/products': 'Products',
      '/admin/inventory': 'Inventory',
      '/admin/discounts': 'Discounts',
      '/admin/orders': 'Orders',
      '/app': 'Products',
      '/app/cart': 'Cart',
      '/app/orders': 'My Orders',
    }
    const moduleName = orderDetailMatch ? 'Order Details' : moduleNames[currentPath] ?? 'Home'
    document.title = `Orderly | ${moduleName}`
  }, [currentPath, orderDetailMatch])

  const renderPage = () => {
    switch (currentPath) {
      case '/login':
        return <LoginPage navigate={navigate} />
      case '/signup':
        return <SignupPage navigate={navigate} />
      case '/admin':
        return <AdminDashboard navigate={navigate} />
      case '/admin/stores':
        return <StoresPage navigate={navigate} />
      case '/admin/products':
        return <ProductsPage navigate={navigate} />
      case '/admin/inventory':
        return <InventoryPage navigate={navigate} />
      case '/admin/discounts':
        return <DiscountsPage navigate={navigate} />
      case '/admin/orders':
        return <AdminOrdersPage navigate={navigate} />
      case '/app':
        return <ProductCatalog navigate={navigate} />
      case '/app/cart':
        return <CartPage navigate={navigate} />
      case '/app/orders':
        return <OrdersPage navigate={navigate} />
      default:
        if (orderDetailMatch) {
          return <OrdersPage navigate={navigate} orderId={Number(orderDetailMatch[1])} />
        }
        return <LandingPage navigate={navigate} />
    }
  }

  if (isAdminRoute) {
    return renderPage()
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col justify-between selection:bg-[#00288e]/20 selection:text-[#00288e]">
      <Navbar currentPath={currentPath} navigate={navigate} />
      <main className="flex-1">{renderPage()}</main>
    </div>
  )
}

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
