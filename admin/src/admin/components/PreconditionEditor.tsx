import { Plus, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';
import { SkillIcon } from '../../components/SkillIcon';
import type { CardPrecondition, Skill } from '../../data/types';

interface Props {
  preconditions: CardPrecondition[];
  onChange: (preconditions: CardPrecondition[]) => void;
  allSkills: Skill[];
  currentSkillId: string;
}

export function PreconditionEditor({ preconditions, onChange, allSkills, currentSkillId }: Props) {
  const update = (index: number, patch: Partial<CardPrecondition>) => {
    const next = [...preconditions];
    next[index] = { ...next[index], ...patch };
    if (patch.type === 'skill') {
      delete next[index].cardName;
    }
    // When changing skill, reset card selection
    if (patch.skillId !== undefined) {
      delete next[index].cardName;
    }
    onChange(next);
  };

  const remove = (index: number) => onChange(preconditions.filter((_, i) => i !== index));

  const add = () => onChange([...preconditions, { type: 'card', skillId: currentSkillId || allSkills[0]?.id }]);

  return (
    <div className="space-y-2">
      {preconditions.length === 0 && (
        <p className="text-[10px] text-muted-foreground">No preconditions. This card can be selected freely.</p>
      )}
      {preconditions.map((pc, i) => {
        const selectedSkill = allSkills.find(s => s.id === pc.skillId);
        return (
          <div key={i} className="flex items-center gap-2 rounded-md border border-border/50 bg-secondary/30 p-2">
            {/* Type: card or skill */}
            <Select value={pc.type} onValueChange={v => update(i, { type: v as 'card' | 'skill' })}>
              <SelectTrigger className="w-24 h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="skill">Skill</SelectItem>
              </SelectContent>
            </Select>

            {/* Skill selector */}
            <Select value={pc.skillId ?? '_pick'} onValueChange={v => update(i, { skillId: v === '_pick' ? undefined : v })}>
              <SelectTrigger className="w-40 h-7 text-xs">
                <SelectValue placeholder="Select skill..." />
              </SelectTrigger>
              <SelectContent>
                {allSkills.map(s => (
                  <SelectItem key={s.id} value={s.id}>
                    <span className="flex items-center gap-1.5">
                      <SkillIcon skill={s} size={14} />
                      {s.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Card selector (only when type is 'card' and skill is selected) */}
            {pc.type === 'card' && selectedSkill && (
              <Select value={pc.cardName ?? '_pick'} onValueChange={v => update(i, { cardName: v === '_pick' ? undefined : v })}>
                <SelectTrigger className="flex-1 h-7 text-xs">
                  <SelectValue placeholder="Select card..." />
                </SelectTrigger>
                <SelectContent>
                  {selectedSkill.cards.map(c => (
                    <SelectItem key={`${c.name}-${c.tier}`} value={c.name}>
                      <span className="flex items-center gap-1.5">
                        {c.name}
                        <span className="text-muted-foreground text-[9px]">T{c.tier}</span>
                        {c.tag !== 'Standard' && (
                          <span className={`text-[9px] ${c.tag === 'Chain' ? 'text-[var(--color-chain)]' : 'text-[var(--color-combo)]'}`}>
                            {c.tag}
                          </span>
                        )}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)} className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive">
              <X className="h-3 w-3" />
            </Button>
          </div>
        );
      })}
      <Button type="button" variant="outline" size="sm" onClick={add} className="gap-1 text-xs">
        <Plus className="h-3 w-3" /> Add Precondition
      </Button>
    </div>
  );
}
