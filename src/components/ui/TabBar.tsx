import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { usePremium } from '@/hooks/usePremium';

interface Tab {
  path: string;
  label: string;
  icon: React.ReactNode;
  premiumOnly?: boolean;
  hideWhenPremium?: boolean;
}

// Simple SVG line icons (SF Symbols aesthetic)
const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

const PaletteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <circle cx="8" cy="10" r="1.5" fill="currentColor" />
    <circle cx="12" cy="7.5" r="1.5" fill="currentColor" />
    <circle cx="16" cy="10" r="1.5" fill="currentColor" />
    <circle cx="9" cy="14.5" r="1.5" fill="currentColor" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const StarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const TABS: Tab[] = [
  { path: '/', label: 'Home', icon: <HomeIcon /> },
  { path: '/backgrounds', label: 'Backgrounds', icon: <PaletteIcon /> },
  { path: '/export', label: 'Export', icon: <DownloadIcon /> },
  { path: '/premium', label: 'Premium', icon: <StarIcon />, hideWhenPremium: true },
];

export function TabBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isPremiumUser = usePremium();

  const visibleTabs = TABS.filter((tab) => !(tab.hideWhenPremium && isPremiumUser));

  // Hide tab bar on non-tab routes (QR create/edit, purchase)
  const isTabRoute = TABS.some((t) => t.path === location.pathname);
  if (!isTabRoute) return null;

  return (
    <nav className="flex items-center justify-around h-14 bg-[var(--color-glass)] backdrop-blur-xl border-t border-[var(--color-glass-border)] pb-[env(safe-area-inset-bottom)]">
      {visibleTabs.map((tab) => {
        const active = location.pathname === tab.path;
        return (
          <button
            key={tab.path}
            className={cn(
              'flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors duration-150',
              active ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-tertiary)]',
            )}
            onClick={() => navigate(tab.path)}
          >
            {tab.icon}
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
