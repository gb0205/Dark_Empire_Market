"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, ShoppingCart, Users, BarChart3, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/common/Logo'; // Assuming you want the main logo
import { Separator } from '@/components/ui/separator';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  // { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card text-card-foreground border-r border-border/60 flex flex-col">
      <div className="p-4 border-b border-border/60">
        <Link href="/admin" className="flex items-center gap-2">
           <ShieldCheck className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-orbitron font-bold">Admin Panel</h1>
        </Link>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-muted hover:text-foreground',
              pathname === item.href ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground' : 'text-muted-foreground'
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>
      <Separator />
       <div className="p-4 mt-auto border-t border-border/60">
        <Link href="/"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-muted hover:text-foreground text-muted-foreground'
            )}
        >
            <Home className="h-5 w-5" />
            Back to Store
        </Link>
      </div>
    </aside>
  );
}
