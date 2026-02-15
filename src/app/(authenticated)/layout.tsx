"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { SessionProvider } from "next-auth/react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/portfolio", label: "Portfolio", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { href: "/investments", label: "Investments", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { href: "/surveys", label: "Surveys", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
  { href: "/reports", label: "Reports", icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { href: "/billing", label: "Billing", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
];

function NavIcon({ d }: { d: string }) {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
    </svg>
  );
}

function BrandIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <circle cx="19" cy="19" r="11" fill="#FFFFFF"/>
      <circle cx="45" cy="19" r="11" fill="#FFFFFF"/>
      <circle cx="19" cy="45" r="11" fill="#FFFFFF"/>
      <circle cx="45" cy="45" r="11" fill="#22B8CF"/>
      <path d="M39.5 45.5L43 49L51 41" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SidebarContent({ pathname, session, onNavClick }: { pathname: string; session: any; onNavClick?: () => void }) {
  return (
    <>
      <div className="p-6 border-b border-blue-800">
        <div className="flex items-center gap-2">
          <BrandIcon className="w-7 h-7 flex-shrink-0" />
          <div>
            <h1 className="text-base font-bold leading-tight">VC Comply</h1>
            <p className="text-blue-300 text-xs leading-tight">
              {session?.user?.vcFirmName || "Dashboard"}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-800 text-white"
                  : "text-blue-200 hover:bg-blue-800 hover:text-white"
              }`}
            >
              <NavIcon d={item.icon} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-blue-800">
        <div className="text-sm text-blue-300 mb-2 truncate">
          {session?.user?.email}
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 text-sm text-blue-300 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </>
  );
}

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile top bar */}
      <div className="lg:hidden bg-blue-900 text-white flex items-center justify-between px-4 h-14 fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center gap-2">
          <BrandIcon className="w-7 h-7" />
          <span className="text-sm font-bold">VC Comply</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md hover:bg-blue-800 transition-colors"
        >
          {mobileMenuOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-blue-900 text-white flex flex-col">
            <SidebarContent pathname={pathname} session={session} onNavClick={() => setMobileMenuOpen(false)} />
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-blue-900 text-white flex-col fixed h-full z-20">
        <SidebarContent pathname={pathname} session={session} />
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 pt-14 lg:pt-0 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </SessionProvider>
  );
}
