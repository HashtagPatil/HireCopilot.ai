"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Moon, Sun, ChevronDown, Menu, X, Monitor, LogOut, User, Settings, ShieldCheck, HelpCircle, BookOpen, MessageSquare, Zap, Globe, Wand2, ArrowRight, Briefcase, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import Cookies from 'js-cookie';

const themes = [
  { name: "Zinc", value: "zinc", color: "bg-zinc-500" },
  { name: "Blue", value: "blue", color: "bg-blue-500" },
  { name: "Rose", value: "rose", color: "bg-rose-500" },
  { name: "Orange", value: "orange", color: "bg-orange-500" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeColorTheme, setActiveColorTheme] = useState("zinc");
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(!!Cookies.get('token'));
    const saved = localStorage.getItem("color-theme") || "blue";
    setActiveColorTheme(saved);
    // IMPORTANT: Apply theme to document on mount so CSS variables take effect
    document.documentElement.setAttribute("data-theme", saved);
    
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return null;

  const handleColorChange = (value: string) => {
    setActiveColorTheme(value);
    localStorage.setItem("color-theme", value);
    document.documentElement.setAttribute("data-theme", value);
    setIsThemeOpen(false);
  };

  const handleLogout = () => {
    Cookies.remove('token');
    setIsLoggedIn(false);
    router.push('/login');
  };

  const isLandingPage = pathname === '/';

  const landingLinks = [
    { name: 'Features', href: '/resources?type=features', icon: Sparkles },
    { name: 'Pricing', href: '/resources?type=pricing', icon: Zap },
    { name: 'Solutions', href: '/resources?type=solutions', icon: Globe },
    { name: 'About', href: '/resources?type=about', icon: ShieldCheck },
  ];

  const dashboardLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: Monitor },
    { name: 'Jobs', href: '/jobs', icon: Briefcase },
    { name: 'Generator', href: '/generator', icon: Wand2 },
    { name: 'Careers Page', href: '/public-jobs', icon: Globe },
  ];

  const currentLinks = isLoggedIn && !isLandingPage ? dashboardLinks : landingLinks;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4",
        isScrolled || !isLandingPage 
          ? "bg-white/80 backdrop-blur-md border-b border-slate-200 py-4 shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        {/* Logo & Neural Pulse */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group relative">
            <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-all duration-300 relative">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">HireCopilot</span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 mt-1">Recruitment Platform</span>
            </div>
          </Link>

          {/* Desktop Nav - Context Aware */}
          <nav className="hidden lg:flex items-center gap-1">
            {!isLoggedIn || isLandingPage ? currentLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className={cn(
                  "px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 group/nav relative overflow-hidden",
                  pathname === link.href ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {pathname === link.href && (
                  <motion.div 
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <link.icon className={cn("w-3.5 h-3.5 relative z-10 transition-transform group-hover/nav:scale-110", pathname === link.href ? "text-primary" : "text-primary/40")} />
                <span className="relative z-10">{link.name}</span>
              </Link>
            )) : (
              <div className="flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-semibold ml-4">
                 <Activity className="w-4 h-4" /> System Active
              </div>
            )}
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          {/* Theme Selector */}
          <div className="hidden sm:flex items-center bg-white border border-slate-200 rounded-full px-2 py-1.5 shadow-sm gap-2">
            <button 
              onClick={() => setIsThemeOpen(!isThemeOpen)}
              className="px-3 py-1 rounded-full bg-slate-50 hover:bg-slate-100 transition-all flex items-center gap-2 border border-slate-200"
            >
              <div className={cn("w-2.5 h-2.5 rounded-full", themes.find(t => t.value === activeColorTheme)?.color)} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">{activeColorTheme}</span>
            </button>
            <div className="w-px h-4 bg-slate-200" />
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-full hover:bg-slate-100 transition-all text-slate-500 hover:text-primary"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {isLoggedIn ? (
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-3 p-1.5 rounded-full bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition-all group"
              >
                <div className="flex flex-col items-end px-2">
                  <span className="text-xs font-semibold text-slate-900 leading-none">Administrator</span>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[10px] font-medium text-slate-500 uppercase">Admin</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                  AD
                </div>
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 p-4 shadow-xl z-50"
                  >
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 relative overflow-hidden">
                         <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Profile</p>
                         <div className="flex items-center gap-3 text-left">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">AD</div>
                            <div>
                               <p className="font-semibold text-sm text-slate-900">Administrator</p>
                               <p className="text-xs text-slate-500">admin@hirecopilot.ai</p>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-1">
                        {[
                          { name: 'Dashboard', icon: Monitor, href: '/dashboard' },
                          { name: 'Settings', icon: Settings, href: '/resources?type=settings' },
                          { name: 'Security', icon: ShieldCheck, href: '/resources?type=trust' },
                          { name: 'Help', icon: HelpCircle, href: '/resources?type=faq' },
                        ].map((item) => (
                          <Link key={item.name} href={item.href} onClick={() => setIsUserMenuOpen(false)}>
                            <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-all group/matrix text-slate-700 hover:text-slate-900">
                              <div className="flex items-center gap-3">
                                <item.icon className="w-4 h-4 opacity-70" />
                                <span className="text-sm font-medium">{item.name}</span>
                              </div>
                            </button>
                          </Link>
                        ))}
                      </div>

                      <div className="h-px bg-slate-100 my-2" />

                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all text-sm font-semibold"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="rounded-full px-6 font-semibold text-sm text-slate-600 hover:text-slate-900">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="rounded-full px-8 h-12 bg-primary text-white hover:bg-primary/90 shadow-sm transition-all font-semibold text-sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Nexus Toggle */}
          <button className="md:hidden p-3 glass rounded-xl border-white/10" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Spectral Nexus */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden glass-deep border-t border-white/5 mt-5 rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col gap-2 p-8">
              {currentLinks.map((link) => (
                <Link key={link.name} href={link.href} className="flex items-center gap-4 p-5 rounded-2xl hover:bg-white/5 text-lg font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">
                  <link.icon className="w-6 h-6 text-primary" />
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-white/5 my-4" />
              <div className="grid grid-cols-2 gap-4">
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full h-12 rounded-xl font-semibold">Login</Button>
                </Link>
                <Link href="/register" className="w-full">
                  <Button className="w-full h-12 rounded-xl font-semibold bg-primary text-white">Sign Up</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Theme Dropdown */}
      <AnimatePresence>
        {isThemeOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed top-20 right-32 w-56 bg-white rounded-3xl border border-slate-200 p-4 shadow-xl z-[100]"
          >
            <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Color Theme</p>
            <div className="space-y-1 mt-2">
              {themes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => handleColorChange(t.value)}
                  className={cn(
                    "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-left",
                    activeColorTheme === t.value ? "bg-slate-100 text-slate-900" : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <div className={cn("w-3.5 h-3.5 rounded-full", t.color)} />
                  <span className="text-sm font-medium">{t.name}</span>
                  {activeColorTheme === t.value && <div className="ml-auto w-2 h-2 rounded-full bg-primary" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
