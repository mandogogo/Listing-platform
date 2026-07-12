export function VerificationSeal({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="seal" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="text-sm font-medium text-emerald">{label}</span>
    </span>
  );
}
