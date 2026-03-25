import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Sword, Cpu, Link2, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { GameDataContext, useGameDataProvider } from './hooks/useGameData';
import { ToastProvider } from './components/Toast';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/skills', label: 'Skills', icon: Sword, end: false },
  { to: '/admin/combos', label: 'Combos', icon: Link2, end: false },
  { to: '/admin/chips', label: 'Chip Sockets', icon: Cpu, end: false },
  { to: '/admin/status-effects', label: 'Status Effects', icon: Sparkles, end: false },
];

export function AdminLayout() {
  const ctx = useGameDataProvider();

  return (
    <GameDataContext.Provider value={ctx}>
      <ToastProvider>
        <div className="flex h-screen overflow-hidden bg-background">
          {/* Sidebar */}
          <aside className="flex h-screen w-[220px] min-w-[220px] flex-col border-r border-border/50 bg-card/80">
            <div className="px-5 pt-5 pb-4">
              <div className="text-xs font-black tracking-[0.25em] uppercase text-foreground/90">Rogue Defense</div>
              <div className="text-xs font-black tracking-[0.25em] uppercase text-primary">Admin Panel</div>
            </div>
            <div className="mx-4 h-px bg-border/50" />
            <nav className="flex flex-1 flex-col gap-0.5 px-3 pt-4">
              {NAV.map(({ to, label, icon: Icon, end }) => (
                <NavLink key={to} to={to} end={end}>
                  {({ isActive }) => (
                    <div className={cn(
                      'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-all duration-200',
                      isActive
                        ? 'bg-primary/8 text-primary font-semibold'
                        : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground font-medium',
                    )}>
                      {isActive && (
                        <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-primary" />
                      )}
                      <Icon className={cn('h-4 w-4 shrink-0', isActive && 'text-primary')} />
                      <span>{label}</span>
                    </div>
                  )}
                </NavLink>
              ))}
            </nav>
            <div className="p-4">
              <a
                href="http://localhost:5173"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg border border-border/40 bg-muted/30 px-4 py-3 text-center text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              >
                Open Encyclopedia
              </a>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 overflow-y-auto">
            {ctx.loading ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">Loading data...</div>
            ) : ctx.error ? (
              <div className="flex h-full items-center justify-center text-destructive">Error: {ctx.error}</div>
            ) : (
              <Outlet />
            )}
          </main>
        </div>
      </ToastProvider>
    </GameDataContext.Provider>
  );
}
