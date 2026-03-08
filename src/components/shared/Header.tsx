'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

import Image from 'next/image';

function getInitials(nom: string, prenom: string): string {
  const p = (prenom || '').trim().charAt(0);
  const n = (nom || '').trim().charAt(0);
  return (p + n).toUpperCase() || '?';
}

const SCROLL_THRESHOLD = 24;

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [aProposOpen, setAProposOpen] = useState(false);
  const [aProposMobileOpen, setAProposMobileOpen] = useState(false);
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
    { href: '/adhesion', label: 'Adhésion' },
    { href: '/partenaires', label: 'Partenaires' },
  ];

  const aProposSublinks = [
    { href: '/a-propos/mot-du-president', label: 'Mot du président' },
    { href: '/a-propos/presentation', label: 'Présentation' },
    { href: '/a-propos/historique', label: 'Historique' },
    { href: '/a-propos/equipe', label: 'Équipe' },
    { href: '/a-propos/missions-visions', label: 'Missions & Visions' },
    { href: '/a-propos/valeurs', label: 'Valeurs' },
    { href: '/a-propos/documents', label: 'Documents administratifs' },
  ];

  const headerBg = scrolled
    ? 'bg-white border-b border-neutral-100 shadow-sm'
    : 'bg-white/80 backdrop-blur-md border-b border-transparent';
  const transitionClass = 'transition-all duration-300 ease-out';

  return (
    <header
      className={`sticky top-0 z-50 ${headerBg} ${transitionClass}`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + titre */}
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <Image
              src="/amicale-logo.svg"
              alt="Logo Amicale FPHM"
              width={40}
              height={48}
              className="h-10 w-auto flex-shrink-0 object-contain"
            />
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
              const isAPropos = link.href === '/a-propos';
              const isActive = isAPropos ? pathname.startsWith('/a-propos') : pathname === link.href;
              if (isAPropos) {
                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => setAProposOpen(true)}
                    onMouseLeave={() => setAProposOpen(false)}
                  >
                    <Link
                      href={link.href}
                      className={`relative font-body font-medium py-2 group inline-block ${
                        isActive ? 'text-primary-600' : 'text-neutral-600 hover:text-primary-600'
                      } ${transitionClass}`}
                    >
                      {link.label}
                      <span
                        className={`absolute bottom-0 left-0 h-[1.5px] bg-primary-500 origin-left transition-transform duration-200 ${
                          isActive ? 'w-full scale-x-100' : 'w-full scale-x-0 group-hover:scale-x-100'
                        }`}
                      />
                    </Link>
                    {aProposOpen && (
                      <div className="absolute left-0 top-full pt-1 z-50">
                        <div className="py-2 min-w-[220px] bg-white rounded-2xl shadow-card-lg border border-neutral-100">
                          {aProposSublinks.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className={`block px-4 py-2.5 text-sm font-body ${
                                pathname === sub.href
                                  ? 'text-primary-600 bg-primary-50'
                                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-primary-600'
                              } transition-colors first:rounded-t-2xl last:rounded-b-2xl`}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
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
                </Link>
              );
            })}
          </div>

          {/* Right: CTA or User dropdown */}
          <div className="hidden md:flex items-center gap-4">
            {!isLoggedIn ? (
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl font-body font-semibold px-5 py-2.5 text-base border-2 border-primary-500 text-primary-600 hover:bg-primary-50 transition-all duration-200"
              >
                Login
              </Link>
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
                      {!isAdmin && (
                        <Link
                          href="/membres"
                          className="flex items-center gap-2 px-4 py-2.5 text-neutral-700 hover:bg-neutral-50 transition-colors"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Mon espace
                        </Link>
                      )}
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2.5 text-neutral-700 hover:bg-neutral-50 transition-colors"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
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
            mobileMenuOpen ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 border-t border-neutral-100 bg-white shadow-lg rounded-b-2xl">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                if (link.href === '/a-propos') {
                  return (
                    <div key={link.href}>
                      <button
                        type="button"
                        onClick={() => setAProposMobileOpen(!aProposMobileOpen)}
                        className={`w-full text-left px-4 py-3 rounded-xl font-body font-medium flex items-center justify-between ${
                          pathname.startsWith('/a-propos')
                            ? 'text-primary-600 bg-primary-50'
                            : 'text-neutral-600 hover:bg-neutral-50'
                        }`}
                      >
                        {link.label}
                        <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${aProposMobileOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {aProposMobileOpen && (
                        <div className="pl-4 pb-2 flex flex-col gap-0.5">
                          <Link
                            href="/a-propos"
                            className={`px-4 py-2 rounded-lg text-sm ${
                              pathname === '/a-propos' ? 'text-primary-600 bg-primary-50' : 'text-neutral-600'
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Vue d&apos;ensemble
                          </Link>
                          {aProposSublinks.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className={`px-4 py-2 rounded-lg text-sm ${
                                pathname === sub.href ? 'text-primary-600 bg-primary-50' : 'text-neutral-600'
                              }`}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
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
                );
              })}
              {!isLoggedIn && (
                <div className="pt-2 px-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center w-full gap-2 rounded-xl font-body font-semibold px-5 py-2.5 text-base border-2 border-primary-500 text-primary-600 hover:bg-primary-50 transition-all duration-200"
                  >
                    Login
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
