import React from 'react'
import {
  Network,
  Store,
  ShoppingCart,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CheckCircle2,
  MapPin,
  ShoppingBag,
  ClipboardCheck,
  Truck,
  Route,
} from 'lucide-react'

interface LandingPageProps {
  navigate?: (path: string) => void
}

export const LandingPage: React.FC<LandingPageProps> = ({ navigate }) => {
  return (
    <div className="flex flex-col w-full bg-[#f8f9ff]">
      {/* Announcement strip */}
      <section className="w-full bg-[#eff4ff] border-b border-[#c4c5d5]/40 py-2.5 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-[#444653]">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#dae2fd] text-[#3f465c]">
              Update
            </span>
            <span>Orderly Multi-Store Routing Engine v2.4 is now live with real-time stock sync.</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-1 text-[#0b1c30] font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" /> 42 Local Stores Connected
            </span>
          </div>
        </div>
      </section>

      {/* Hero */}
      <section className="w-full bg-[#f8f9ff] py-12 md:py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col items-start gap-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dce9ff] border border-[#00288e]/20 text-[#00288e] text-sm">
              <Network className="w-4 h-4" />
              <span>Multi-Store Ordering Platform</span>
            </div>

            <h1 className="text-4xl md:text-[44px] md:leading-[52px] font-bold text-[#0b1c30] tracking-tight">
              Order from multiple stores, <br className="hidden sm:inline" />
              all in one place.
            </h1>

            <p className="text-base md:text-lg text-[#444653] max-w-xl leading-relaxed">
              Browse products, add them to your cart, and let Orderly find the right stores to fulfill your order
              automatically with zero friction.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 w-full sm:w-auto">
              <button
                onClick={() => navigate?.('/signup')}
                className="inline-flex items-center justify-center h-11 px-6 rounded-md bg-[#1e40af] text-white font-semibold text-sm hover:bg-[#00288e] transition-colors shadow-sm gap-2 cursor-pointer"
              >
                <span>Start Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate?.('/login')}
                className="inline-flex items-center justify-center h-11 px-5 rounded-md bg-white border border-[#c4c5d5] text-[#0b1c30] font-medium text-sm hover:bg-[#eff4ff] transition-colors cursor-pointer"
              >
                Admin Login
              </button>
            </div>

            <div className="flex items-center gap-2 pt-2 text-sm text-[#444653]">
              <BadgeCheck className="w-[18px] h-[18px] text-emerald-700" />
              <span>Real-time inventory from verified local stores across the region</span>
            </div>
          </div>

          {/* Dispatch preview card */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-white rounded-lg border border-[#c4c5d5]/60 shadow-sm overflow-hidden">
              <div className="px-5 py-4 bg-[#eff4ff] border-b border-[#c4c5d5]/50 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#444653]">
                      Live Dispatch View
                    </span>
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <h3 className="text-base font-semibold text-[#0b1c30] mt-0.5">Order Summary #ORD-1025</h3>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#dae2fd] text-[#5c647a]">
                  Fulfillment Routing
                </span>
              </div>

              <div className="p-5 flex flex-col gap-5">
                <div className="rounded-md border border-[#c4c5d5]/40 p-3.5">
                  <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#c4c5d5]/30">
                    <div className="flex items-center gap-2">
                      <Store className="w-[18px] h-[18px] text-[#00288e]" />
                      <span className="text-sm font-semibold text-[#0b1c30]">Tarsali Store</span>
                    </div>
                    <span className="text-xs text-[#444653]">Zone 1 • 2.4 km away</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#757684]" />
                        <span className="text-[#0b1c30] font-medium">Wireless Optical Mouse</span>
                        <span className="text-[#444653]">× 1</span>
                      </div>
                      <span className="font-medium text-[#0b1c30] tabular-nums">₹850.00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#757684]" />
                        <span className="text-[#0b1c30] font-medium">Ultra HDMI Cable (2m)</span>
                        <span className="text-[#444653]">× 1</span>
                      </div>
                      <span className="font-medium text-[#0b1c30] tabular-nums">₹400.00</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border border-[#c4c5d5]/40 p-3.5">
                  <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#c4c5d5]/30">
                    <div className="flex items-center gap-2">
                      <Store className="w-[18px] h-[18px] text-[#00288e]" />
                      <span className="text-sm font-semibold text-[#0b1c30]">Makarpura Store</span>
                    </div>
                    <span className="text-xs text-[#444653]">Zone 3 • 5.1 km away</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#757684]" />
                        <span className="text-[#0b1c30] font-medium">Full HD IPS Monitor 24"</span>
                        <span className="text-[#444653]">× 1</span>
                      </div>
                      <span className="font-medium text-[#0b1c30] tabular-nums">₹6,500.00</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#c4c5d5]/40 flex flex-col gap-3">
                  <div className="flex items-center justify-between bg-emerald-50 px-3 py-2 rounded border border-emerald-200">
                    <div className="flex items-center gap-2">
                      <Route className="w-[18px] h-[18px] text-emerald-800" />
                      <span className="text-xs font-semibold text-emerald-800">Smart fulfillment enabled</span>
                    </div>
                    <span className="text-xs text-emerald-700">Consolidated Hub</span>
                  </div>
                  <div className="flex items-center justify-between px-1">
                    <div>
                      <span className="text-sm text-[#444653] block">Subtotal (3 items)</span>
                      <span className="text-base font-bold text-[#0b1c30]">Total Order Value</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-[#0b1c30] tabular-nums">₹7,750.00</span>
                      <span className="text-xs text-[#444653] block">Inclusive of all store taxes</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#eff4ff] px-5 py-3 border-t border-[#c4c5d5]/40 flex items-center justify-between text-sm text-[#444653]">
                <span className="flex items-center gap-1.5 text-xs font-medium text-[#0b1c30]">
                  <Truck className="w-4 h-4 text-[#00288e]" />
                  Dispatch Route: 2 Dispatches, 1 Invoice
                </span>
                <span className="text-xs font-semibold text-[#00288e]">Ready to Ship</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics bar */}
      <section className="w-full bg-white border-y border-[#c4c5d5]/40 py-8 px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-[#0b1c30] tabular-nums">99.8%</span>
            <span className="text-sm text-[#444653] mt-1">Order Fulfillment Accuracy</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-[#0b1c30] tabular-nums">&lt; 25 mins</span>
            <span className="text-sm text-[#444653] mt-1">Average Store Prep Time</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-[#0b1c30] tabular-nums">40+</span>
            <span className="text-sm text-[#444653] mt-1">Partner Stores Indexed</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-[#0b1c30] tabular-nums">1-Click</span>
            <span className="text-sm text-[#444653] mt-1">Centralized Multi-Bill Invoicing</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full bg-[#f8f9ff] py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-[#00288e]">Core Capabilities</span>
            <h2 className="text-2xl font-bold text-[#0b1c30] mt-1">Why Orderly</h2>
            <p className="text-base md:text-lg text-[#444653] mt-2">
              Simple inventory and ordering across complex physical store networks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Store,
                title: 'Multiple Stores',
                body: 'Shop products available across different local stores without needing separate accounts or multi-stage checkouts.',
                note: 'Unified catalog across all locations',
              },
              {
                icon: Network,
                title: 'Smart Fulfillment',
                body: 'Orderly automatically searches live branch inventory and splits line items across nearest available facilities.',
                note: 'Automated routing for faster pickup or delivery',
              },
              {
                icon: ShoppingCart,
                title: 'Simple Ordering',
                body: 'Add products to your single consolidated cart and place your complete multi-store order with standard, transparent terms.',
                note: 'Single checkout, clear status tracking',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-lg border border-[#c4c5d5]/60 p-6 shadow-sm hover:border-[#00288e]/40 transition-colors flex flex-col"
              >
                <div className="w-10 h-10 rounded-md bg-[#dae2fd] flex items-center justify-center mb-5 text-[#00288e]">
                  <feature.icon className="w-[22px] h-[22px]" />
                </div>
                <h3 className="text-base font-semibold text-[#0b1c30]">{feature.title}</h3>
                <p className="text-sm text-[#444653] mt-2 leading-normal">{feature.body}</p>
                <div className="mt-auto pt-5 border-t border-[#c4c5d5]/30 flex items-center gap-2 text-sm text-[#0b1c30] font-medium">
                  <CheckCircle2 className="w-[18px] h-[18px] text-[#00288e]" />
                  <span>{feature.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="w-full bg-white border-y border-[#c4c5d5]/40 py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="text-left max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-[#00288e]">
              Operational Workflow
            </span>
            <h2 className="text-2xl font-bold text-[#0b1c30] mt-1">How It Works</h2>
            <p className="text-base md:text-lg text-[#444653] mt-2">
              Three simple steps to coordinate multi-location stock into one seamless order.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: 'Browse Products',
                body: 'Explore hardware, IT accessories, supplies, and electronics from verified partner stores in your local area.',
                note: 'Live store stock indexes updated continuously',
                icon: MapPin,
              },
              {
                step: 2,
                title: 'Add to Cart',
                body: 'Combine items from totally different stores into a single basket. You never have to create separate transactions.',
                note: 'Automatic line item grouping per partner',
                icon: ShoppingBag,
              },
              {
                step: 3,
                title: 'Place Your Order',
                body: 'Orderly coordinates fulfillment automatically for direct pickup or consolidated dispatch to your doorstep.',
                note: 'Single unified receipt and live status updates',
                icon: ClipboardCheck,
              },
            ].map((s) => (
              <div key={s.step} className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#00288e] text-white flex items-center justify-center text-sm font-bold">
                    {s.step}
                  </div>
                  <span className="text-sm font-semibold uppercase text-[#444653]">Step {['One', 'Two', 'Three'][s.step - 1]}</span>
                </div>
                <h3 className="text-base font-semibold text-[#0b1c30] mt-1">{s.title}</h3>
                <p className="text-sm text-[#444653] leading-relaxed">{s.body}</p>
                <div className="mt-2 text-sm text-[#565e74] flex items-center gap-1.5">
                  <s.icon className="w-4 h-4" />
                  <span>{s.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full bg-[#f8f9ff] py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg border border-[#c4c5d5]/60 p-8 md:p-12 shadow-sm text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-[#dae2fd] flex items-center justify-center mb-4 text-[#00288e]">
            <Store className="w-6 h-6" />
          </div>
          <h2 className="text-2xl md:text-[28px] md:leading-8 font-bold text-[#0b1c30]">Ready to start ordering?</h2>
          <p className="text-base md:text-lg text-[#444653] mt-2 max-w-lg">
            Find products near you and order in minutes with unified store fulfillment.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 w-full sm:w-auto justify-center">
            <button
              onClick={() => navigate?.('/signup')}
              className="w-full sm:w-auto inline-flex items-center justify-center h-11 px-8 rounded-md bg-[#1e40af] text-white font-semibold text-sm hover:bg-[#00288e] transition-colors shadow-sm gap-2 cursor-pointer"
            >
              <span>Start Shopping</span>
              <ShoppingCart className="w-[18px] h-[18px]" />
            </button>
          </div>
          <div className="mt-6 pt-5 border-t border-[#c4c5d5]/40 w-full max-w-md flex items-center justify-center">
            <button
              onClick={() => navigate?.('/login')}
              className="text-sm text-[#00288e] hover:underline font-medium inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Need to manage your store? Sign in to Admin</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-white mt-auto border-t border-[#c4c5d5]/40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#444653]">
            © {new Date().getFullYear()} Orderly — Multi-Store Ordering System. All rights reserved.
          </p>
          <nav className="flex items-center gap-6">
            <button onClick={() => navigate?.('/login')} className="text-sm text-[#444653] hover:text-[#0b1c30] transition-colors cursor-pointer">
              Sign In
            </button>
            <button onClick={() => navigate?.('/signup')} className="text-sm text-[#444653] hover:text-[#0b1c30] transition-colors cursor-pointer">
              Create Account
            </button>
          </nav>
        </div>
      </footer>
    </div>
  )
}
