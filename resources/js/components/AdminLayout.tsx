import React from 'react'
import {
  LayoutDashboard,
  Store,
  Package,
  Warehouse,
  Tag,
  ShoppingCart,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.js'

interface AdminLayoutProps {
  currentPath: string
  navigate: (path: string) => void
  children: React.ReactNode
}

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/stores', label: 'Stores', icon: Store },
  { path: '/admin/products', label: 'Products', icon: Package },
  { path: '/admin/inventory', label: 'Inventory', icon: Warehouse },
  { path: '/admin/discounts', label: 'Discounts', icon: Tag },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
]

export const AdminLayout: React.FC<AdminLayoutProps> = ({ currentPath, navigate, children }) => {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex">
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-[#c4c5d5]/40 z-40 flex flex-col justify-between">
        <div className="flex flex-col">
          <div className="h-16 px-6 flex items-center gap-2 border-b border-[#c4c5d5]/30">
            <div className="w-8 h-8 rounded-lg bg-[#00288e] flex items-center justify-center text-white">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m-10 0a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
            </div>
            <span className="text-base font-semibold text-[#0b1c30] tracking-tight">Orderly</span>
            <span className="px-1.5 py-0.5 rounded bg-[#e5eeff] text-[#00288e] text-xs font-semibold">Admin</span>
          </div>
          <nav className="flex flex-col gap-1 px-3 pt-3">
            {NAV_ITEMS.map((item) => {
              const active = currentPath === item.path
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left cursor-pointer ${
                    active
                      ? 'bg-[#1e40af] text-white font-medium'
                      : 'text-[#444653] hover:bg-[#eff4ff] hover:text-[#0b1c30]'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
        <div className="flex flex-col border-t border-[#c4c5d5]/30 px-3 py-3 gap-1">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#ba1a1a] hover:bg-[#ffdad6] transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="pl-64 flex flex-col flex-1 min-h-screen">
        <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-[#c4c5d5]/40 z-30 flex items-center justify-end px-6">
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right">
              <span className="text-sm font-semibold text-[#0b1c30] leading-tight">
                {user?.fullName || user?.email}
              </span>
              <span className="text-xs text-[#444653] leading-tight">Admin</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#00288e] flex items-center justify-center text-white text-sm font-semibold">
              {(user?.fullName || user?.email || '?').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <main className="w-full pt-16 flex-1">
          <div className="p-6 max-w-[1440px] w-full mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
