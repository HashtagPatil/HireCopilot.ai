"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Briefcase, Users, MessageSquare, LogOut, FileText, Globe, Cpu, LayoutDashboard, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Jobs', href: '/jobs', icon: Briefcase },
  { name: 'Candidates', href: '/candidates', icon: Users },
  { name: 'AI Assistant', href: '/chat', icon: MessageSquare },
  { name: 'JD Generator', href: '/generator', icon: Sparkles },
  { name: 'Careers Page', href: '/public-jobs', icon: Globe },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; initials: string }>({
    name: 'Administrator',
    email: 'admin@hirecopilot.ai',
    initials: 'AD',
  });

  useEffect(() => {
    try {
      const token = Cookies.get('token');
      if (token) {
        // Try to decode basic info from JWT payload (base64)
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.email) {
          const emailName = payload.email.split('@')[0];
          const name = payload.name || emailName.charAt(0).toUpperCase() + emailName.slice(1);
          const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
          setUser({ name, email: payload.email, initials });
        }
      }
    } catch (_) {
      // Use defaults
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/login');
  };

  return (
    <div className="flex h-full w-[260px] flex-col bg-white px-4 py-6">
      {/* Navigation */}
      <nav className="flex-1 space-y-1 pt-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-4 mb-3">Navigation</p>
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                className={cn(
                  'relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 group',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                )}
              >
                <Icon className={cn('w-5 h-5 flex-shrink-0 transition-colors', isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600')} />
                <span>{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User Info + Logout */}
      <div className="mt-auto space-y-2 pt-4 border-t border-slate-100">
        {/* User Card */}
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
            {user.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all group"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
