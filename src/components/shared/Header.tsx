'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

function getInitials(nom: string, prenom: string): string {
  const p = (prenom || '').trim().charAt(0);
  const n = (nom || '').trim().charAt(0);
  return (p + n).toUpperCase() || '?';
}

const SCROLL_THRESHOLD = 8;

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ticking = useRef(false);
  const isLoggedIn = isAuthenticated;
  const userInitials = user ? getInitials(user.nom, user.prenom) : '?';

  useEffect(() => {
    const updateScrollState = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
      ticking.current = false;
    };
    const onScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(updateScrollState);
        ticking.current = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/a-propos', label: 'À propos' },
    { href: '/evenements', label: 'Événements' },
    { href: '/annonces', label: 'Annonces' },
    { href: '/partenaires', label: 'Partenaires' },
  ];

  const headerBg = scrolled
    ? 'bg-[rgba(247,245,238,0.92)] backdrop-blur-[10px] border-b border-[var(--line)]'
    : 'bg-transparent border-b border-transparent';
  const transitionClass = 'transition-all duration-300 ease-out';

  return (
    <header
      className={`sticky top-0 z-50 ${headerBg} ${transitionClass}`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo + titre */}
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[var(--accent)] text-white text-[21px] italic leading-none [font-family:'Newsreader',serif]">
              A
            </span>
            <span className="flex flex-col leading-none">
              <span className="[font-family:'Newsreader',serif] text-[17px] text-[var(--ink)]">
                Amicale FPHM
              </span>
              <span className="font-mono text-[10px] text-[var(--ink-3)] mt-1">
                Enseignants · Monastir
              </span>
            </span>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = link.href === '/a-propos' ? pathname.startsWith('/a-propos') : pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-2 group text-[14px] font-medium text-[var(--ink-2)] hover:text-[var(--ink)] ${transitionClass}`}
                >
                  {link.label}
                  <span
                    className={`absolute left-0 -bottom-[1px] h-[1px] w-full origin-left bg-[var(--ink)] transition-transform duration-200 ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Right: CTA or User dropdown */}
          <div className="hidden md:flex items-center gap-3">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-full font-body font-medium px-5 py-2.5 text-[14px] border border-[var(--line-strong)] text-[var(--ink-2)] hover:bg-[var(--surface)] transition-all duration-200"
                >
                  Connexion
                </Link>
                <Link
                  href="/adhesion"
                  className="group inline-flex items-center justify-center gap-2 rounded-full font-body font-medium px-5 py-2.5 text-[14px] bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-deep)] transition-all duration-200"
                >
                  Adhérer
                  <span className="transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="w-10 h-10 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] font-semibold flex items-center justify-center hover:bg-[var(--accent-tint)] transition-colors"
                >
                  {userInitials}
                </button>
                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 py-2 w-48 bg-[var(--surface)] rounded-2xl shadow-card-lg border border-[var(--line)] z-50 animate-fade-up">
                      {!isAdmin && (
                        <Link
                          href="/membres"
                          className="flex items-center gap-2 px-4 py-2.5 text-[var(--ink-2)] hover:bg-[var(--accent-tint)] transition-colors"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Mon espace
                        </Link>
                      )}
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2.5 text-[var(--ink-2)] hover:bg-[var(--accent-tint)] transition-colors"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                      )}
                      <div className="border-t border-[var(--line)] my-2" />
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
            className="md:hidden p-2 rounded-full hover:bg-[var(--surface)] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-[var(--ink-2)]" />
            ) : (
              <Menu className="w-6 h-6 text-[var(--ink-2)]" />
            )}
          </button>
        </div>

        {/* Mobile Menu - slide down */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            mobileMenuOpen ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 border-t border-[var(--line)] bg-[var(--bg)] rounded-b-2xl">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = link.href === '/a-propos' ? pathname.startsWith('/a-propos') : pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-3 rounded-xl font-body font-medium text-[14px] ${
                      isActive
                        ? 'text-[var(--ink)] bg-[var(--accent-tint)]'
                        : 'text-[var(--ink-2)] hover:bg-[var(--surface)]'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {!isLoggedIn && (
                <div className="pt-2 px-2 flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center w-full gap-2 rounded-full font-body font-medium px-5 py-2.5 text-[14px] border border-[var(--line-strong)] text-[var(--ink-2)] bg-transparent transition-all duration-200"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/adhesion"
                    onClick={() => setMobileMenuOpen(false)}
                    className="group inline-flex items-center justify-center w-full gap-2 rounded-full font-body font-medium px-5 py-2.5 text-[14px] bg-[var(--accent)] text-[var(--bg)] transition-all duration-200"
                  >
                    Adhérer
                    <span className="transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
