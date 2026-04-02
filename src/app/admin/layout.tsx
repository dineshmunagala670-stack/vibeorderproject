'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { Loader2 } from 'lucide-react';

const ADMIN_EMAIL = 'admin@vibe.com'.toLowerCase(); 

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      if (pathname === '/admin/login') {
        setLoading(false);
        return;
      }

      if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL) {
        router.replace('/admin/login');
      } else {
        setAuthorized(true);
      }
      setLoading(false);
    };
    checkUser();
  }, [pathname, router, supabase]);

  if (loading && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
        <Loader2 className="animate-spin text-black" size={32} />
      </div>
    );
  }

  if (pathname === '/admin/login') return <>{children}</>;

  return (
    // Added text-black here to fix white-on-white issues globally
    <div className="flex min-h-screen bg-[#faf9f6] text-black">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}