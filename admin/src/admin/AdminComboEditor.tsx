import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { FormField } from './components/FormField';
import { StringListEditor } from './components/StringListEditor';
import { SkillIcon } from '../components/SkillIcon';
import { useGameData } from './hooks/useGameData';
import { useToast } from './components/Toast';
import { slugify, cn } from '../lib/utils';
import type { Combo } from '../data/types';

const empty: Combo = { id: '', name: '', skills: [], description: '', cards: [], synergy: '', rating: 3, playstyle: '', tips: [] };

export function AdminComboEditor() {
  const { comboId } = useParams();
  const isNew = !comboId;
  const { data, saveCombo } = useGameData();
  const navigate = useNavigate();
  const { toast } = useToast();

  const existing = data?.combos.find(c => c.id === comboId);
  const [form, setForm] = useState<Combo>(existing ? { ...existing, skills: [...existing.skills], cards: [...existing.cards], tips: [...existing.tips] } : { ...empty });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existing) setForm({ ...existing, skills: [...existing.skills], cards: [...existing.cards], tips: [...existing.tips] });
  }, [existing]);

  const set = <K extends keyof Combo>(key: K, value: Combo[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const toggleSkill = (skillId: string) => {
    set('skills', form.skills.includes(skillId)
      ? form.skills.filter(s => s !== skillId)
      : [...form.skills, skillId],
    );
  };

  const handleSave = async () => {
    if (!form.name.trim()) return toast('Name is required', 'error');
    if (form.skills.length < 2) return toast('Select at least 2 skills', 'error');
    const toSave = { ...form, id: isNew ? slugify(form.name) : form.id };
    setSaving(true);
    try {
      await saveCombo(toSave, isNew);
      toast(isNew ? 'Combo created' : 'Combo saved');
      navigate('/admin/combos');
    } catch (err) {
      toast(String(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!data) return null;

  // Get all cards from selected skills for the card picker
  const availableCards = data.skills
    .filter(s => form.skills.includes(s.id))
    .flatMap(s => s.cards.map(c => c.name));
  const uniqueCards = [...new Set(availableCards)];

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/combos')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-black tracking-tight text-foreground">
          {isNew ? 'New Combo' : `Edit: ${form.name}`}
        </h1>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Name">
            <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Burn & Detonate" />
          </FormField>
          <FormField label="Rating">
            <div className="flex items-center gap-1 h-9">
              {[1, 2, 3, 4, 5].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => set('rating', r as Combo['rating'])}
                  className="p-0.5"
                >
                  <Star className={cn('h-5 w-5', r <= form.rating ? 'fill-[#FFD700] text-[#FFD700]' : 'fill-none text-border')} />
                </button>
              ))}
            </div>
          </FormField>
        </div>

        <FormField label="Description">
          <Textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} />
        </FormField>

        <FormField label="Synergy Explanation">
          <Textarea value={form.synergy} onChange={e => set('synergy', e.target.value)} rows={2} />
        </FormField>

        <FormField label="Playstyle">
          <Textarea value={form.playstyle} onChange={e => set('playstyle', e.target.value)} rows={2} />
        </FormField>

        {/* Skill Multi-Select */}
        <FormField label="Skills">
          <div className="flex flex-wrap gap-2 rounded-[var(--radius)] border border-border bg-input p-3">
            {data.skills.map(skill => {
              const selected = form.skills.includes(skill.id);
              return (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => toggleSkill(skill.id)}
                  className={cn(
                    'rounded-md border px-2.5 py-1 text-xs font-medium transition-all',
                    selected
                      ? 'border-primary/50 bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/30',
                  )}
                >
                  <SkillIcon skill={skill} size={16} /> {skill.name}
                </button>
              );
            })}
          </div>
        </FormField>

        {/* Key Cards */}
        <FormField label="Key Cards">
          <div className="flex flex-wrap gap-2 rounded-[var(--radius)] border border-border bg-input p-3">
            {uniqueCards.length === 0 && (
              <span className="text-xs text-muted-foreground">Select skills first to see available cards</span>
            )}
            {uniqueCards.map(cardName => {
              const selected = form.cards.includes(cardName);
              return (
                <button
                  key={cardName}
                  type="button"
                  onClick={() => set('cards', selected ? form.cards.filter(c => c !== cardName) : [...form.cards, cardName])}
                  className={cn(
                    'rounded-md border px-2 py-0.5 text-[11px] font-medium transition-all',
                    selected
                      ? 'border-[#B44FFF]/50 bg-[#B44FFF]/10 text-[#D4A0FF]'
                      : 'border-border text-muted-foreground hover:border-[#B44FFF]/30',
                  )}
                >
                  {cardName}
                </button>
              );
            })}
          </div>
        </FormField>

        <FormField label="Tips">
          <StringListEditor items={form.tips} onChange={v => set('tips', v)} placeholder="Add a tip..." />
        </FormField>
      </div>

      <div className="mt-8 flex gap-3">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save'}
        </Button>
        <Button variant="outline" onClick={() => navigate('/admin/combos')}>Cancel</Button>
      </div>
    </div>
  );
}
