import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useGameData } from './hooks/useGameData';
import { useToast } from './components/Toast';
import { ConfirmDialog } from './components/ConfirmDialog';

export function AdminStatusEffectsList() {
  const { data, deleteStatusEffect } = useGameData();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  if (!data) return null;

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Status Effects</h1>
          <p className="mt-1 text-sm text-muted-foreground">{data.statusEffects.length} effects</p>
        </div>
        <Button onClick={() => navigate('/admin/status-effects/new')} className="gap-1">
          <Plus className="h-4 w-4" /> Add Effect
        </Button>
      </div>

      <div className="space-y-2">
        {data.statusEffects.map(effect => (
          <Card key={effect.id} className="transition-all hover:brightness-110">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg text-xl" style={{ backgroundColor: `${effect.color}15` }}>
                {effect.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{effect.name}</span>
                  <div className="h-3 w-3 rounded-full border border-border" style={{ backgroundColor: effect.color }} />
                </div>
                <p className="text-[11px] text-muted-foreground truncate">{effect.description}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{effect.sources.length} sources</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/status-effects/${effect.id}`)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(effect.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Delete Status Effect"
        description="This action cannot be undone."
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            await deleteStatusEffect(deleteTarget);
            toast('Status effect deleted');
          } catch (err) {
            toast(String(err), 'error');
          }
        }}
      />
    </div>
  );
}
