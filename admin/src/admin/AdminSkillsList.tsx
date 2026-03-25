import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { SkillIcon } from '../components/SkillIcon';
import { useGameData } from './hooks/useGameData';
import { useToast } from './components/Toast';
import { ConfirmDialog } from './components/ConfirmDialog';
import type { SkillType } from '../data/types';

const TYPE_COLORS: Record<SkillType, string> = {
  fire: '#FF4500', electric: '#FFD700', energy: '#B44FFF', physical: '#3B82F6', field: '#00FF88',
};

export function AdminSkillsList() {
  const { data, deleteSkill } = useGameData();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  if (!data) return null;

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Skills</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {data.skills.length} skills &middot; {data.skills.reduce((a, s) => a + s.cards.length, 0)} total cards
          </p>
        </div>
        <Button onClick={() => navigate('/admin/skills/new')} className="gap-1">
          <Plus className="h-4 w-4" /> Add Skill
        </Button>
      </div>

      <div className="space-y-2">
        {data.skills.map(skill => {
          const color = TYPE_COLORS[skill.type];
          const chainCount = skill.cards.filter(c => c.tag === 'Chain').length;
          const comboCount = skill.cards.filter(c => c.tag === 'Combo').length;
          const specialCount = skill.cards.filter(c => c.isSpecial).length;
          // Check referential integrity
          const referencedByCombos = data.combos.filter(c => c.skills.includes(skill.id));

          return (
            <Card key={skill.id} className="transition-all hover:brightness-110" style={{ border: `1px solid ${color}25` }}>
              <CardContent className="flex items-center gap-4 p-4">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${color}10`, border: `1px solid ${color}20` }}
                >
                  <SkillIcon skill={skill} size={48} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-foreground">{skill.name}</span>
                    <Badge variant={skill.type as any} className="text-[9px]">{skill.type}</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{skill.description}</p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                    <span>{skill.cards.length} cards</span>
                    <span>&middot;</span>
                    <span>{specialCount} special</span>
                    {chainCount > 0 && <><span>&middot;</span><span className="text-[var(--color-chain)]">{chainCount} chain</span></>}
                    {comboCount > 0 && <><span>&middot;</span><span className="text-[var(--color-combo)]">{comboCount} combo</span></>}
                    {referencedByCombos.length > 0 && (
                      <><span>&middot;</span><span>in {referencedByCombos.length} combo(s)</span></>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/skills/${skill.id}`)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(skill.id)} className="text-muted-foreground hover:text-destructive">
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
        title="Delete Skill"
        description={
          deleteTarget && data.combos.some(c => c.skills.includes(deleteTarget))
            ? 'Warning: This skill is referenced by combos. Deleting it may break those combos.'
            : 'This action cannot be undone.'
        }
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            const result = await deleteSkill(deleteTarget);
            if (result.comboReferences?.length > 0) {
              toast(`Skill deleted. Warning: referenced by combos: ${result.comboReferences.join(', ')}`);
            } else {
              toast('Skill deleted');
            }
          } catch (err) {
            toast(String(err), 'error');
          }
        }}
      />
    </div>
  );
}
