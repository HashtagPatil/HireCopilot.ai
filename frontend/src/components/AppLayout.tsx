"use client";

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { cn } from '@/lib/utils';
import Cookies from 'js-cookie';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!Cookies.get('token'));
  }, [pathname]);

  const isLandingPage = pathname === '/';
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isResourcesPage = pathname.startsWith('/resources');
  const isPublicJobs = pathname === '/public-jobs';

  // Only show sidebar if logged in AND on a dashboard route AND not on a public page
  const showSidebar = isLoggedIn && !isLandingPage && !isAuthPage && !isResourcesPage && !isPublicJobs;

  return (
    <div className={cn("min-h-screen bg-slate-50 text-slate-900 selection:bg-primary/20 selection:text-primary flex flex-col")}>
      {!isAuthPage && <Navbar />}
      
      <div className={cn(
        "flex flex-1 relative w-full",
        !isAuthPage && !isLandingPage && "pt-16"
      )}>
        {showSidebar && (
          <aside className="hidden md:block fixed left-0 top-16 h-[calc(100vh-4rem)] border-r border-slate-200 bg-white z-40 overflow-y-auto">
            <Sidebar />
          </aside>
        )}
        <main className={cn(
          "flex-1 w-full",
          showSidebar && "md:pl-[260px]",
          !isLandingPage && !isAuthPage && "px-0 pb-12"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}


