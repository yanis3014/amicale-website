'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Newspaper,
  Users,
  ArrowLeft,
  LogOut,
  Menu,
} from 'lucide-react';
import { AdminGuard } from '@/components/auth/AdminGuard';
import { useAuth } from '@/contexts/AuthContext';
import { getAdminStats } from '@/lib/api/admin';

const navItems: { href: string; label: string; icon: typeof Users; badgeKey?: 'cotisations' }[] = [
  { href: '/admin/dashboard', label: 'Vue d\'ensemble', icon: LayoutDashboard },
  { href: '/admin/evenements', label: 'Événements', icon: Calendar },
  { href: '/admin/annonces', label: 'Annonces', icon: Newspaper },
  { href: '/admin/enseignants', label: 'Enseignants', icon: Users },
  { href: '/admin/members', label: 'Membres & Cotisations', icon: Users, badgeKey: 'cotisations' },
];

function AdminLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cotisationsPending, setCotisationsPending] = useState<number>(0);

  useEffect(() => {
    getAdminStats()
      .then((stats) => setCotisationsPending(stats.cotisations_en_attente))
      .catch(() => setCotisationsPending(0));
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const initials = user?.prenom && user?.nom
    ? `${user.prenom[0]}${user.nom[0]}`.toUpperCase()
    : 'AD';

  const sidebar = (
    <aside className="w-64 bg-forest-900 flex flex-col h-full">
      <div className="p-6 border-b border-white/10">
        <h1 className="font-display text-xl font-bold text-white">
          Amicale Admin
        </h1>
        <p className="text-sm text-white/50 mt-1">Dashboard</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const badge = item.badgeKey === 'cotisations' ? cotisationsPending : 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                isActive
                  ? 'bg-primary-500/20 text-primary-300 border-l-2 border-primary-400 rounded-l-xl rounded-r-none'
                  : 'text-white/60 hover:bg-white/8 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {badge > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-2">
        <div className="px-4 py-3 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-500/30 flex items-center justify-center font-display font-bold text-primary-300">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-white text-sm">{user?.prenom} {user?.nom}</p>
            <p className="text-white/50 text-xs">Administrateur</p>
          </div>
        </div>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/8 hover:text-white font-medium transition-colors"
          onClick={() => setSidebarOpen(false)}
        >
          <ArrowLeft className="w-5 h-5" />
          Retour au site
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:text-red-200 hover:bg-red-500/10 font-medium transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex sticky top-0 h-screen flex-shrink-0">
        {sidebar}
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-64 transform transition-transform duration-300 ease-out lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebar}
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto min-w-0">
        <div className="lg:hidden sticky top-0 z-30 flex items-center gap-4 bg-neutral-50 border-b border-neutral-100 px-4 py-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl hover:bg-neutral-100"
            aria-label="Menu"
          >
            <Menu className="w-6 h-6 text-neutral-700" />
          </button>
          <span className="font-display font-bold text-neutral-900">Admin</span>
        </div>
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminGuard>
  );
}
