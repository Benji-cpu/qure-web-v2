const FEATURES = [
  { label: 'Customize secondary QR slot', free: false },
  { label: 'Single QR mode', free: false },
  { label: '8 gradient presets', free: true },
  { label: 'Custom gradient creation', free: false },
  { label: 'Image upload backgrounds', free: false },
  { label: 'Watermark-free exports', free: false },
  { label: 'All 14 QR types', free: true },
  { label: 'QR color customization', free: true },
  { label: 'QR positioning & sizing', free: true },
];

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M6.5 11.5l-3-3 1-1 2 2 5-5 1 1z" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" opacity={0.4}>
    <path d="M11 7V5a3 3 0 00-6 0v2H4v6h8V7h-1zm-4-2a1 1 0 012 0v2H7V5z" />
  </svg>
);

export function FeatureList() {
  return (
    <div className="flex flex-col gap-2">
      {FEATURES.map((f) => (
        <div key={f.label} className="flex items-center gap-3">
          <div className={f.free ? 'text-[var(--color-success)]' : 'text-[var(--color-premium)]'}>
            {f.free ? <CheckIcon /> : <LockIcon />}
          </div>
          <span className="text-sm text-[var(--color-text-primary)]">{f.label}</span>
          {!f.free && (
            <span className="ml-auto text-[10px] font-semibold text-[var(--color-premium)]">PRO</span>
          )}
        </div>
      ))}
    </div>
  );
}
