'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { Sparkles } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9FB]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-2xl animate-pulse-soft bg-gradient-to-br from-[#E91E63] to-[#C2185B]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div className="absolute -inset-2 rounded-3xl border-2 border-transparent border-t-[#E91E63] border-r-[#F8BBD0] animate-spin-slow" />
          </div>
          <p className="font-semibold text-[#E91E63] tracking-widest text-sm uppercase">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Prevent flash of protected content while redirecting
  if (!session) {
    return null;
  }

  return <>{children}</>;
}
