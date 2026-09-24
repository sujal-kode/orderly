import React from 'react'
import { LogOut, User as UserIcon, ShoppingCart } from 'lucide-react'
import { useAuth } from '../context/AuthContext.js'
import { useCart } from '../context/CartContext.js'

interface NavbarProps {
  currentPath: string
  navigate: (path: string) => void
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const { user, isAuthenticated, logout } = useAuth()
  const { itemCount } = useCart()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const isCustomer = isAuthenticated && user?.role === 'customer'

  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
      <div className="h-16 max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button
            onClick={() => navigate(isCustomer ? '/app' : '/')}
            className="flex items-center gap-3 bg-transparent border-0 cursor-pointer text-left p-0"
          >
            <div className="w-8 h-8 rounded-lg bg-[#00288e] flex items-center justify-center text-white">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m-10 0a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight text-[#0b1c30]">Orderly</span>
          </button>

          {isCustomer && (
            <nav className="hidden sm:flex items-center gap-6">
              <button
                onClick={() => navigate('/app')}
                className={`text-sm transition-colors cursor-pointer ${
                  currentPath === '/app' ? 'text-[#00288e] font-semibold' : 'text-[#444653] hover:text-[#0b1c30]'
                }`}
              >
                Products
              </button>
              <button
                onClick={() => navigate('/app/orders')}
                className={`text-sm transition-colors cursor-pointer ${
                  currentPath === '/app/orders' ? 'text-[#00288e] font-semibold' : 'text-[#444653] hover:text-[#0b1c30]'
                }`}
              >
                My Orders
              </button>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {isCustomer ? (
                <button
                  onClick={() => navigate('/app/cart')}
                  className="relative p-2 text-[#444653] hover:text-[#00288e] hover:bg-[#eff4ff] rounded-lg transition-colors cursor-pointer"
                  title="Cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#00288e] text-white text-[10px] font-semibold flex items-center justify-center">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  )}
                </button>
              ) : (
                currentPath !== '/admin' && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="inline-flex items-center h-9 px-4 rounded-md bg-[#1e40af] text-white text-sm font-semibold hover:bg-[#00288e] transition-colors cursor-pointer"
                  >
                    Dashboard
                  </button>
                )
              )}
              <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-[#c4c5d5]/60">
                <div className="w-8 h-8 rounded-full bg-[#00288e] flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-[#0b1c30]">{user?.fullName || user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-[#565e74] hover:text-[#ba1a1a] rounded-lg hover:bg-[#f8f9ff] transition-colors cursor-pointer"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              {currentPath !== '/login' && (
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm font-medium text-[#444653] hover:text-[#0b1c30] transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              )}
              {currentPath !== '/signup' && (
                <button
                  onClick={() => navigate('/signup')}
                  className="inline-flex items-center h-9 px-4 rounded-md bg-[#1e40af] text-white text-sm font-semibold hover:bg-[#00288e] transition-colors cursor-pointer"
                >
                  Create Account
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
