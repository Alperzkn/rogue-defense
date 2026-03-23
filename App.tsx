import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Sword, Cpu, Link2, Sparkles, Zap } from 'lucide-react';
import { cn } from './src/lib/utils';
import { AnimatedBackground } from './src/components/AnimatedBackground';
import { HomeScreen } from './src/screens/HomeScreen';
import { SkillsScreen } from './src/screens/SkillsScreen';
import { SkillDetailScreen } from './src/screens/SkillDetailScreen';
import { ChipsScreen } from './src/screens/ChipsScreen';
import { CombosScreen } from './src/screens/CombosScreen';
import { StatusEffectsScreen } from './src/screens/StatusEffectsScreen';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home, exact: true },
  { path: '/skills', label: 'Skills', icon: Sword, exact: false },
  { path: '/chips', label: 'Chips', icon: Cpu, exact: true },
  { path: '/combos', label: 'Combos', icon: Link2, exact: true },
  { path: '/status', label: 'Status Effects', icon: Sparkles, exact: true },
];

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="relative z-10 flex h-screen w-[220px] min-w-[220px] flex-col border-r border-border bg-card/95 backdrop-blur-sm">
      {/* Gradient border right */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />

      {/* Logo */}
      <div className="flex items-center gap-3 p-5 pb-4">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          style={{ background: 'linear-gradient(135deg, #7B2FBE, #00C8FF)', boxShadow: '0 0 20px #00C8FF30' }}
        >
          <Zap className="h-5 w-5 text-white" />
        </motion.div>
        <div>
          <div className="text-sm font-black tracking-[0.2em] text-foreground">ROGUE</div>
          <div
            className="text-sm font-black tracking-[0.2em]"
            style={{ color: '#00C8FF', textShadow: '0 0 10px #00C8FF80' }}
          >
            DEFENSE
          </div>
        </div>
      </div>

      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 p-3 pt-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Encyclopedia
        </p>
        {NAV_ITEMS.map(({ path, label, icon: Icon, exact }) => {
          const isActive = exact
            ? location.pathname === path
            : location.pathname.startsWith(path);

          return (
            <NavLink key={path} to={path}>
              <motion.div
                whileHover={{ x: 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={cn(
                  'relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors duration-150',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-primary"
                    style={{ boxShadow: '0 0 6px #00C8FF' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon className="h-4 w-4 shrink-0" />
                <span className={cn('font-medium', isActive && 'text-glow')}>{label}</span>
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 pt-0">
        <div className="rounded-lg border border-border bg-muted/50 p-3">
          <p className="text-[11px] font-semibold text-foreground">Hybrid Tower TD</p>
          <p className="text-[10px] text-muted-foreground">Game Encyclopedia v1.0</p>
        </div>
      </div>
    </aside>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="min-h-full"
      >
        <Routes location={location}>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/skills" element={<SkillsScreen />} />
          <Route path="/skills/:skillId" element={<SkillDetailScreen />} />
          <Route path="/chips" element={<ChipsScreen />} />
          <Route path="/combos" element={<CombosScreen />} />
          <Route path="/status" element={<StatusEffectsScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative flex h-screen overflow-hidden bg-background">
        <AnimatedBackground />
        <Sidebar />
        <main className="relative z-10 flex-1 overflow-y-auto">
          <AnimatedRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}
