'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Newspaper,
  Users,
  Handshake,
  ArrowLeft,
  LogOut,
  Menu,
  ClipboardList,
  Wallet,
  FileText,
  Mail,
  Home,
} from 'lucide-react';
import { AdminGuard } from '@/components/auth/AdminGuard';
import { useAuth } from '@/contexts/AuthContext';

const navItems: { href: string; label: string; icon: typeof Users }[] = [
  { href: '/admin/dashboard', label: 'Vue d\'ensemble', icon: LayoutDashboard },
  { href: '/admin/annonces', label: 'Événements', icon: Newspaper },
  { href: '/admin/evenements', label: 'Archives', icon: Calendar },
  { href: '/admin/enseignants', label: 'Enseignants', icon: Users },
  { href: '/admin/a-propos', label: 'Contenus À propos', icon: FileText },
  { href: '/admin/accueil', label: 'Page d\'accueil', icon: Home },
  { href: '/admin/members', label: 'Membres & Cotisations', icon: Users },
  { href: '/admin/emails', label: 'Envoi d\'emails', icon: Mail },
  { href: '/admin/finances', label: 'Finances', icon: Wallet },
  { href: '/admin/partenaires', label: 'Partenaires', icon: Handshake },
  { href: '/admin/suivi', label: 'Suivi des actions', icon: ClipboardList },
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

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const initials = user?.prenom && user?.nom
    ? `${user.prenom[0]}${user.nom[0]}`.toUpperCase()
    : 'AD';

  const sidebar = (
    <aside className="w-56 bg-forest-900 flex flex-col h-full min-h-0">
      <div className="flex-shrink-0 p-3 border-b border-white/10">
        <h1 className="font-display text-base font-bold text-white">
          Amicale Admin
        </h1>
        <p className="text-xs text-white/50">Dashboard</p>
      </div>

      <nav className="flex-1 min-h-0 p-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[rgba(255,255,255,0.08)] text-white border-l-2 border-[var(--accent)] rounded-l-lg rounded-r-none'
                  : 'text-white/60 hover:bg-white/8 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex-shrink-0 p-2 border-t border-white/10 space-y-1">
        <div className="px-2 py-2 rounded-lg flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--accent)]/30 flex items-center justify-center font-display font-bold text-primary-300 text-xs flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-white text-xs truncate">{user?.prenom} {user?.nom}</p>
            <p className="text-white/50 text-[10px]">Administrateur</p>
          </div>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/8 hover:text-white font-medium transition-colors"
          onClick={() => setSidebarOpen(false)}
        >
          <ArrowLeft className="w-4 h-4 flex-shrink-0" />
          Retour au site
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-300 hover:text-red-200 hover:bg-red-500/10 font-medium transition-colors"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Déconnexion
        </button>
      </div>
    </aside>
  );

  return (
    <div className="h-screen bg-[var(--bg)] flex overflow-hidden">
      {/* Desktop Sidebar — fixe, ne défile pas */}
      <div className="hidden lg:flex flex-shrink-0 w-56 h-full overflow-hidden">
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
        className={`fixed top-0 left-0 z-50 h-full w-56 transform transition-transform duration-300 ease-out lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebar}
      </div>

      {/* Zone droite — scroll seule si le contenu dépasse */}
      <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="lg:hidden flex-shrink-0 flex items-center gap-4 bg-[var(--bg)] border-b border-neutral-100 px-4 py-3">
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
        <div className="flex-1 min-h-0 overflow-y-auto">
          {children}
        </div>
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
