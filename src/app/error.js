'use client';

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-semibold text-[#1D1D1F] mb-3">Something went wrong</h2>
        <p className="text-[#86868B] mb-6">We encountered an unexpected error. Please try again.</p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-[#1D1D1F] text-white rounded-full text-sm font-medium hover:bg-black transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
