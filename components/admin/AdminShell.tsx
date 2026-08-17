'use client'

import { ReactNode, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { X } from 'lucide-react'

import { AdminHeader } from './AdminHeader'
import { AdminSidebar } from './AdminSidebar'

type AdminShellProps = {
  children: ReactNode
}

export function AdminShell({ children }: AdminShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('aura_admin_authenticated') === 'true'

    if (!isAuthenticated && pathname !== '/admin/login') {
      router.replace('/admin/login')
      return
    }

    setAuthenticated(isAuthenticated)
    setChecking(false)
  }, [pathname, router])

  if (checking) {
    return null
  }

  if (!authenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#f7f4f2] text-[#493a35]">
      <div className="flex min-h-screen">
        <AdminSidebar />

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Fechar menu"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-[#352c29]/30 backdrop-blur-sm"
            />

            <aside className="relative z-10 h-full w-[270px] bg-[#fcfaf9] shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#e9e1dc] px-5 py-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#80655b]">
                    Minea
                  </p>

                  <p className="mt-1 text-[8px] uppercase tracking-[0.15em] text-[#b09a91]">
                    Administração
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-[#806f68] hover:bg-[#f3ece8]"
                >
                  <X size={17} />
                </button>
              </div>

              <div className="p-5">
                <AdminSidebar />
              </div>
            </aside>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <AdminHeader onMenuClick={() => setMobileMenuOpen(true)} />

          <main>{children}</main>
        </div>
      </div>
    </div>
  )
}
