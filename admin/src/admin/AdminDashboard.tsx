import { useNavigate } from 'react-router-dom';
import { Sword, Cpu, Link2, Sparkles, CreditCard } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { useGameData } from './hooks/useGameData';

export function AdminDashboard() {
  const { data } = useGameData();
  const navigate = useNavigate();
  if (!data) return null;

  const totalCards = data.skills.reduce((a, s) => a + s.cards.length, 0);
  const totalChipStats = data.chipSockets.reduce((a, s) => a + s.stats.length, 0);

  const stats = [
    { label: 'Skills', value: data.skills.length, icon: Sword, color: '#00C8FF', path: '/admin/skills' },
    { label: 'Upgrade Cards', value: totalCards, icon: CreditCard, color: '#B44FFF', path: '/admin/skills' },
    { label: 'Combos', value: data.combos.length, icon: Link2, color: '#FF6B9D', path: '/admin/combos' },
    { label: 'Chip Sockets', value: data.chipSockets.length, icon: Cpu, color: '#FFD700', path: '/admin/chips' },
    { label: 'Chip Stats', value: totalChipStats, icon: Cpu, color: '#FF9100', path: '/admin/chips' },
    { label: 'Status Effects', value: data.statusEffects.length, icon: Sparkles, color: '#00FF88', path: '/admin/status-effects' },
  ];

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <h1 className="text-2xl font-black tracking-tight text-foreground mb-2">Dashboard</h1>
      <p className="text-sm text-muted-foreground mb-8">Manage all game data. Changes are saved directly to gameData.json.</p>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {stats.map(s => (
          <Card
            key={s.label}
            className="cursor-pointer transition-all hover:brightness-110"
            style={{ border: `1px solid ${s.color}25`, background: `linear-gradient(135deg, ${s.color}08, transparent 60%)` }}
            onClick={() => navigate(s.path)}
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${s.color}12` }}>
                  <s.icon className="h-5 w-5" style={{ color: s.color }} />
                </div>
                <div>
                  <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-[11px] text-muted-foreground">{s.label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
