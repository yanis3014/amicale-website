'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import EspaceMemberModal from './EspaceMemberModal';

const PharmaCrossIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-primary-600 flex-shrink-0"
  >
    <path
      d="M12 2L12 22M12 2L8 6M12 2L16 6M12 22L8 18M12 22L16 18M2 12L22 12M2 12L6 8M2 12L6 16M22 12L18 8M22 12L18 16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

function getInitials(nom: string, prenom: string): string {
  const p = (prenom || '').trim().charAt(0);
  const n = (nom || '').trim().charAt(0);
  return (p + n).toUpperCase() || '?';
}

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isLoggedIn = isAuthenticated;
  const userInitials = user ? getInitials(user.nom, user.prenom) : '?';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/a-propos', label: 'À propos' },
    { href: '/evenements', label: 'Événements' },
    { href: '/annonces', label: 'Annonces' },
    { href: '/adhesion', label: 'Adhésion' },
    { href: '/partenaires', label: 'Partenaires' },
  ];

  const headerBg = scrolled
    ? 'bg-white border-b border-neutral-100 shadow-sm'
    : 'bg-white/80 backdrop-blur-md border-b border-transparent';
  const transitionClass = 'transition-all duration-300';

  return (
    <header
      className={`sticky top-0 z-50 ${headerBg} ${transitionClass}`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <PharmaCrossIcon />
            <span className="font-display font-bold text-primary-600 text-xl">
              Amicale
            </span>
            <span className="font-display font-normal text-neutral-400 text-xl">
              FPHM
            </span>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative font-body font-medium py-2 group ${
                    isActive ? 'text-primary-600' : 'text-neutral-600 hover:text-primary-600'
                  } ${transitionClass}`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 h-[1.5px] bg-primary-500 origin-left transition-transform duration-200 ${
                      isActive ? 'w-full scale-x-100' : 'w-full scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                  {isActive && (
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary-500" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right: CTA or User dropdown */}
          <div className="hidden md:flex items-center gap-4">
            {!isLoggedIn ? (
              <Button
                variant="outline"
                onClick={() => setModalOpen(true)}
              >
                Espace Membre
              </Button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-semibold flex items-center justify-center hover:bg-primary-200 transition-colors"
                >
                  {userInitials}
                </button>
                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 py-2 w-48 bg-white rounded-2xl shadow-card-lg border border-neutral-100 z-50 animate-fade-up">
                      <Link
                        href="/membres"
                        className="flex items-center gap-2 px-4 py-2.5 text-neutral-700 hover:bg-neutral-50 transition-colors"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Mon espace
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2.5 text-neutral-700 hover:bg-neutral-50 transition-colors"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          Administration
                        </Link>
                      )}
                      <div className="border-t border-neutral-100 my-2" />
                      <button
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-neutral-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-neutral-700" />
            ) : (
              <Menu className="w-6 h-6 text-neutral-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu - slide down */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            mobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 border-t border-neutral-100 bg-white shadow-lg rounded-b-2xl">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-xl font-body font-medium ${
                    pathname === link.href
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {!isLoggedIn && (
                <div className="pt-2 px-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                  >
                    Espace Membre
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <EspaceMemberModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </header>
  );
};
