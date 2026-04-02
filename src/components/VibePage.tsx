'use client';

import dynamic from 'next/dynamic';

const ShaderBackground = dynamic(() => import('./ShaderBackground'), { ssr: false });

export default function VibePage({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <ShaderBackground />
      <div className="fixed inset-0 -z-10 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="relative z-10 bg-transparent pt-32 px-6">
        {children}
      </div>
    </div>
  );
}