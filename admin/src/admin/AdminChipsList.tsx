import { useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useGameData } from './hooks/useGameData';

export function AdminChipsList() {
  const { data } = useGameData();
  const navigate = useNavigate();
  if (!data) return null;

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-foreground">Chip Sockets</h1>
        <p className="mt-1 text-sm text-muted-foreground">{data.chipSockets.length} sockets &middot; {data.chipSockets.reduce((a, s) => a + s.stats.length, 0)} total stats</p>
      </div>

      <div className="space-y-2">
        {data.chipSockets.map(socket => (
          <Card key={socket.id} className="transition-all hover:brightness-110" style={{ border: `1px solid ${socket.color}25` }}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg text-xl" style={{ backgroundColor: `${socket.color}15` }}>
                {socket.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold" style={{ color: socket.color }}>{socket.name}</span>
                  <span className="text-[10px] text-muted-foreground">{socket.id}</span>
                </div>
                <p className="text-[11px] text-muted-foreground truncate">{socket.description}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {socket.stats.length} stats &middot; {socket.stats.filter(s => s.isUltraRare).length} ultra rare
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/chips/${socket.id}`)}>
                <Pencil className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
