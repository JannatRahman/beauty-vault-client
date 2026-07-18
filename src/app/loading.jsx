export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFF9FB' }}>
      <div className="flex flex-col items-center gap-4">
        {/* Animated logo mark */}
        <div className="relative w-16 h-16">
          <div
            className="absolute inset-0 rounded-2xl animate-pulse-soft"
            style={{ background: 'linear-gradient(135deg, #E91E63, #C2185B)' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
              <path d="M20 3c0 4.97-4.03 9-9 9"/>
            </svg>
          </div>
          {/* Spinner ring */}
          <div
            className="absolute -inset-2 rounded-3xl border-2 border-transparent animate-spin-slow"
            style={{ borderTopColor: '#E91E63', borderRightColor: '#F8BBD0' }}
          />
        </div>
        <div className="text-center">
          <p className="font-semibold text-[#E91E63] tracking-widest text-sm uppercase">
            BeautyVault
          </p>
          <p className="text-[#6B7280] text-xs mt-1">Loading...</p>
        </div>
        {/* Skeleton bars */}
        <div className="flex gap-1.5 mt-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-1.5 h-6 rounded-full animate-pulse-soft"
              style={{
                background: '#E91E63',
                animationDelay: `${i * 0.15}s`,
                opacity: 0.3 + i * 0.15,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}