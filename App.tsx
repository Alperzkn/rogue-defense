import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Sword, Cpu, Link2, Sparkles, Wrench, Coffee, Menu, X, Skull } from 'lucide-react';
import { cn } from './src/lib/utils';
import { TooltipProvider } from './src/components/ui/tooltip';
import { TIMING, EASE } from './src/lib/animations';
import { AnimatedBackground } from './src/components/AnimatedBackground';
import { HomeScreen } from './src/screens/HomeScreen';
import { SkillsScreen } from './src/screens/SkillsScreen';
import { SkillDetailScreen } from './src/screens/SkillDetailScreen';
import { ChipsScreen } from './src/screens/ChipsScreen';
import { CombosScreen } from './src/screens/CombosScreen';
import { StatusEffectsScreen } from './src/screens/StatusEffectsScreen';
import { BuildPlannerScreen } from './src/screens/BuildPlannerScreen';
import { EnemiesScreen } from './src/screens/EnemiesScreen';
import { FeedbackButton } from './src/components/FeedbackForm';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home, exact: true },
  { path: '/skills', label: 'Skills', icon: Sword, exact: false },
  { path: '/chips', label: 'Chips', icon: Cpu, exact: true },
  { path: '/combos', label: 'Combos', icon: Link2, exact: true },
  { path: '/status', label: 'Status Effects', icon: Sparkles, exact: true },
  { path: '/enemies', label: 'Enemies', icon: Skull, exact: true },
  { path: '/build', label: 'Build Planner', icon: Wrench, exact: true },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed z-50 flex h-screen w-[240px] min-w-[240px] flex-col border-r border-border/50 bg-card/95 backdrop-blur-md transition-transform duration-300 ease-out',
          'lg:relative lg:z-10 lg:translate-x-0 lg:bg-card/80',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Header with close button on mobile */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5">
          <div>
            <div className="text-xs font-black tracking-[0.25em] uppercase text-foreground/90">Rogue</div>
            <div className="text-xs font-black tracking-[0.25em] uppercase text-primary">Defense</div>
            <div className="mt-1.5 text-[10px] text-muted-foreground">Game Encyclopedia</div>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary/60 hover:text-foreground lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mx-5 h-px bg-border/50" />

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-0.5 px-3 pt-5 overflow-y-auto">
          {NAV_ITEMS.map(({ path, label, icon: Icon, exact }) => {
            const isActive = exact
              ? location.pathname === path
              : location.pathname.startsWith(path);

            return (
              <NavLink key={path} to={path}>
                <motion.div
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={EASE.bounce}
                  className={cn(
                    'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-all duration-200',
                    isActive
                      ? 'bg-primary/8 text-primary font-semibold'
                      : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground font-medium'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-primary"
                      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                    />
                  )}
                  <Icon className={cn('h-4 w-4 shrink-0', isActive && 'text-primary')} />
                  <span>{label}</span>
                </motion.div>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 space-y-3">
          <a
            href="https://buymeacoffee.com/alperzkn"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-2.5 text-[11px] font-semibold text-yellow-400 transition-all hover:bg-yellow-500/20 hover:border-yellow-500/50"
          >
            <Coffee className="h-4 w-4" />
            Buy me a coffee
          </a>
          <div className="rounded-lg border border-border/40 bg-muted/30 px-4 py-3">
            <p className="text-[11px] font-semibold text-foreground/80">Rogue Defense</p>
            <p className="text-[10px] text-muted-foreground">v2.0 &middot; Updated Mar 2026</p>
          </div>
        </div>
      </aside>
    </>
  );
}

function MobileHeader({ onMenuToggle }: { onMenuToggle: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/50 bg-card/80 backdrop-blur-md px-4 py-3 lg:hidden">
      <button
        type="button"
        aria-label="Open menu"
        onClick={onMenuToggle}
        className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div>
        <span className="text-xs font-black tracking-[0.2em] uppercase text-foreground/90">Rogue </span>
        <span className="text-xs font-black tracking-[0.2em] uppercase text-primary">Defense</span>
      </div>
    </header>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: TIMING.fast, ease: EASE.smooth }}
        className="min-h-full"
      >
        <Routes location={location}>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/skills" element={<SkillsScreen />} />
          <Route path="/skills/:skillId" element={<SkillDetailScreen />} />
          <Route path="/chips" element={<ChipsScreen />} />
          <Route path="/combos" element={<CombosScreen />} />
          <Route path="/status" element={<StatusEffectsScreen />} />
          <Route path="/enemies" element={<EnemiesScreen />} />
          <Route path="/build" element={<BuildPlannerScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <TooltipProvider>
      <BrowserRouter>
        <div className="relative flex h-screen overflow-hidden bg-background">
          <AnimatedBackground />
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="relative z-10 flex-1 overflow-y-auto scroll-smooth flex flex-col min-w-0">
            <MobileHeader onMenuToggle={() => setSidebarOpen(prev => !prev)} />
            <div className="flex-1">
              <AnimatedRoutes />
            </div>
          </main>
          <FeedbackButton />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  );
}
