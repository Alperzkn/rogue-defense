import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useGameData } from './hooks/useGameData';
import { useToast } from './components/Toast';
import { ConfirmDialog } from './components/ConfirmDialog';

const SKILL_TYPE_COLORS: Record<string, string> = {
  fire: '#FF4500', electric: '#FFD700', energy: '#B44FFF', physical: '#3B82F6', field: '#00FF88',
};

export function AdminCombosList() {
  const { data, deleteCombo } = useGameData();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  if (!data) return null;
  const sorted = [...data.combos].sort((a, b) => b.rating - a.rating);

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Combos</h1>
          <p className="mt-1 text-sm text-muted-foreground">{data.combos.length} synergy builds</p>
        </div>
        <Button onClick={() => navigate('/admin/combos/new')} className="gap-1">
          <Plus className="h-4 w-4" /> Add Combo
        </Button>
      </div>

      <div className="space-y-2">
        {sorted.map(combo => {
          const skills = combo.skills.map(sid => data.skills.find(s => s.id === sid)).filter(Boolean);
          return (
            <Card key={combo.id} className="transition-all hover:brightness-110">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex gap-0.5 shrink-0">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`h-3 w-3 ${i < combo.rating ? 'fill-[#FFD700] text-[#FFD700]' : 'fill-none text-border'}`} />
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-foreground">{combo.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {skills.map(skill => (
                      <Badge key={skill!.id} variant={skill!.type as any} className="text-[9px]">
                        {skill!.name}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{combo.cards.length} key cards &middot; {combo.tips.length} tips</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/combos/${combo.id}`)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(combo.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Delete Combo"
        description="This action cannot be undone."
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            await deleteCombo(deleteTarget);
            toast('Combo deleted');
          } catch (err) {
            toast(String(err), 'error');
          }
        }}
      />
    </div>
  );
}
