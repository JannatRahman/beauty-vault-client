import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: 'linear-gradient(135deg, #FFF9FB 0%, #FDE8F0 50%, #FFF9FB 100%)' }}
    >
      <div className="relative mb-6">
        <p
          className="font-display text-[120px] sm:text-[160px] font-bold leading-none select-none"
          style={{
            background: 'linear-gradient(135deg, #E91E63, #F8BBD0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            opacity: 0.15,
          }}
        >
          404
        </p>
        <div className="absolute inset-0 flex items-center justify-center">
          <div>
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #E91E63, #C2185B)' }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <h1 className="font-display text-2xl font-bold text-[#1F2937]">Page Not Found</h1>
          </div>
        </div>
      </div>
      <p className="text-[#6B7280] mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="btn-primary"
        style={{ background: 'linear-gradient(135deg, #E91E63, #C2185B)' }}
      >
        Back to Home
      </Link>
    </div>
  );
}