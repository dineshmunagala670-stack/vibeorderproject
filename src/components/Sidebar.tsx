'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  LogOut
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'Inventory', icon: Package, href: '/admin/inventory' },
    { name: 'Orders', icon: ShoppingCart, href: '/admin/orders' },
    { name: 'Customers', icon: Users, href: '/admin/customers' },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col p-6 sticky top-0">
      <div className="mb-12 px-4">
        <p className="text-2xl font-serif italic tracking-tighter">vibe.admin</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div className={`
                flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group
                ${isActive 
                  ? 'bg-black text-white shadow-lg' 
                  : 'text-gray-400 hover:bg-gray-50 hover:text-black'}
              `}>
                <item.icon size={20} className={isActive ? 'text-white' : 'group-hover:text-black'} />
                <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <button className="flex items-center gap-4 px-4 py-4 mt-auto text-gray-400 hover:text-red-500 transition-colors">
        <LogOut size={20} />
        <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>
      </button>
    </aside>
  );
}