"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Briefcase, Users, MessageSquare, LogOut, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import Cookies from 'js-cookie';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Jobs', href: '/jobs', icon: Briefcase },
  { name: 'Candidates', href: '/candidates', icon: Users },
  { name: 'AI Recruiter', href: '/chat', icon: MessageSquare },
  { name: 'Job Generator', href: '/generator', icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/login' || pathname === '/register') return null;

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/login');
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card px-4 py-8 shadow-sm">
      <div className="mb-10 px-2">
        <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2">
          <span>🌱</span> HireCopilot.ai
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <Icon className={cn('mr-3 h-5 w-5', isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground')} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t pt-4">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 text-muted-foreground group-hover:text-destructive transition-colors" />
          Logout
        </button>
      </div>
    </div>
  );
}
