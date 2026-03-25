import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { FormField } from './components/FormField';
import { StringListEditor } from './components/StringListEditor';
import { SkillIcon } from '../components/SkillIcon';
import { useGameData } from './hooks/useGameData';
import { useToast } from './components/Toast';
import { slugify, cn } from '../lib/utils';
import type { Skill, SkillCard, SkillType, CardTag, CardTier } from '../data/types';

const TYPE_COLORS: Record<SkillType, string> = {
  fire: '#FF4500', electric: '#FFD700', energy: '#B44FFF', physical: '#3B82F6', field: '#00FF88',
};

const TIER_COLORS: Record<CardTier, string> = { 1: '#00C8FF', 2: '#B44FFF', 3: '#FFD700' };
const TIER_LABELS: Record<CardTier, string> = { 1: 'Tier 1 — Initial', 2: 'Tier 2 — Star Tier 2', 3: 'Tier 3 — Star Tier 3' };

const emptySkill: Skill = {
  id: '', name: '', description: '', type: 'fire', icon: '⚔️', cards: [], tips: [],
};

const emptyCard = (tier: CardTier): SkillCard => ({
  name: '', description: '', tag: 'Standard', tier, isSpecial: false,
});

export function AdminSkillEditor() {
  const { skillId } = useParams();
  const isNew = !skillId;
  const { data, saveSkill } = useGameData();
  const navigate = useNavigate();
  const { toast } = useToast();

  const existing = data?.skills.find(s => s.id === skillId);
  const [form, setForm] = useState<Skill>(
    existing ? JSON.parse(JSON.stringify(existing)) : { ...emptySkill, tips: [] },
  );
  const [saving, setSaving] = useState(false);
  const [expandedTiers, setExpandedTiers] = useState<Set<CardTier>>(new Set([1, 2, 3]));
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (existing) setForm(JSON.parse(JSON.stringify(existing)));
  }, [existing]);

  const set = <K extends keyof Skill>(key: K, value: Skill[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const updateCard = (index: number, patch: Partial<SkillCard>) => {
    const cards = [...form.cards];
    cards[index] = { ...cards[index], ...patch };
    set('cards', cards);
  };

  const removeCard = (index: number) => set('cards', form.cards.filter((_, i) => i !== index));

  const addCard = (tier: CardTier) => set('cards', [...form.cards, emptyCard(tier)]);

  const toggleTier = (tier: CardTier) => {
    const next = new Set(expandedTiers);
    next.has(tier) ? next.delete(tier) : next.add(tier);
    setExpandedTiers(next);
  };

  const toggleCardExpand = (key: string) => {
    const next = new Set(expandedCards);
    next.has(key) ? next.delete(key) : next.add(key);
    setExpandedCards(next);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return toast('Name is required', 'error');
    if (form.cards.length === 0) return toast('Add at least one card', 'error');
    const toSave = { ...form, id: isNew ? slugify(form.name) : form.id };
    setSaving(true);
    try {
      await saveSkill(toSave, isNew);
      toast(isNew ? 'Skill created' : 'Skill saved');
      navigate('/admin/skills');
    } catch (err) {
      toast(String(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!data) return null;
  const color = TYPE_COLORS[form.type] || '#00C8FF';

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/skills')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        {!isNew && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}>
            <SkillIcon skill={form} size={40} />
          </div>
        )}
        <h1 className="text-xl font-black tracking-tight text-foreground">
          {isNew ? 'New Skill' : `Edit: ${form.name}`}
        </h1>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-xl border border-border bg-card/50 p-5 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Basic Info</h2>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Name">
              <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Flame Missile" />
            </FormField>
            <FormField label="Type">
              <Select value={form.type} onValueChange={v => set('type', v as SkillType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(['fire', 'electric', 'energy', 'physical', 'field'] as SkillType[]).map(t => (
                    <SelectItem key={t} value={t}>
                      <span style={{ color: TYPE_COLORS[t] }}>{t.charAt(0).toUpperCase() + t.slice(1)}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <FormField label="Description">
            <Textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Icon Image (path)">
              <Input value={form.iconImage ?? ''} onChange={e => set('iconImage', e.target.value || undefined)} placeholder="/icons/flame-missile.png" />
            </FormField>
            <FormField label="Icon Scale">
              <Input type="number" value={form.iconScale ?? ''} onChange={e => set('iconScale', e.target.value ? parseFloat(e.target.value) : undefined)} step="0.1" placeholder="2.1" />
            </FormField>
          </div>

          <FormField label="Tips">
            <StringListEditor items={form.tips ?? []} onChange={v => set('tips', v)} placeholder="Add gameplay tip..." />
          </FormField>
        </div>

        {/* Cards */}
        <div className="rounded-xl border border-border bg-card/50 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Cards ({form.cards.length})
            </h2>
          </div>

          {([1, 2, 3] as CardTier[]).map(tier => {
            const tierCards = form.cards
              .map((card, originalIndex) => ({ card, originalIndex }))
              .filter(({ card }) => card.tier === tier);
            const tierColor = TIER_COLORS[tier];
            const isExpanded = expandedTiers.has(tier);

            return (
              <div key={tier} className="mb-4">
                <button
                  type="button"
                  onClick={() => toggleTier(tier)}
                  className="flex w-full items-center gap-2 mb-2"
                >
                  {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: tierColor }} />
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: tierColor }}>
                    {TIER_LABELS[tier]}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    ({tierCards.length} cards &middot; {tierCards.filter(({ card }) => card.isSpecial).length} special)
                  </span>
                </button>

                {isExpanded && (
                  <div className="ml-6 space-y-2">
                    {tierCards.map(({ card, originalIndex }) => {
                      const cardKey = `${originalIndex}`;
                      const isCardExpanded = expandedCards.has(cardKey);
                      // All sibling cards in this skill (for Chain prerequisite picker)
                      const siblingCards = form.cards.filter((_, i) => i !== originalIndex);
                      const comboSkill = card.tag === 'Combo' && card.requiredSkillId
                        ? data.skills.find(s => s.id === card.requiredSkillId)
                        : null;

                      return (
                        <div key={originalIndex} className="rounded-lg border border-border/50 bg-secondary/20 p-3 space-y-2">
                          {/* Row 1: Name + Tag + Special + Delete */}
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => toggleCardExpand(cardKey)} className="shrink-0">
                              {isCardExpanded
                                ? <ChevronDown className="h-3 w-3 text-muted-foreground" />
                                : <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                            </button>
                            <Input
                              value={card.name}
                              onChange={e => updateCard(originalIndex, { name: e.target.value })}
                              placeholder="Card name"
                              className="flex-1 h-7 text-xs font-medium"
                            />
                            <Select value={card.tag} onValueChange={v => {
                              const patch: Partial<SkillCard> = { tag: v as CardTag };
                              // Clear irrelevant fields when changing tag
                              if (v === 'Standard') { patch.requiredSkillId = undefined; patch.requiresCards = undefined; }
                              if (v === 'Chain') { patch.requiredSkillId = undefined; }
                              if (v === 'Combo') { patch.requiresCards = undefined; }
                              updateCard(originalIndex, patch);
                            }}>
                              <SelectTrigger className="w-28 h-7 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Standard">Standard</SelectItem>
                                <SelectItem value="Chain">Chain</SelectItem>
                                <SelectItem value="Combo">Combo</SelectItem>
                              </SelectContent>
                            </Select>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Checkbox
                                checked={!!card.isSpecial}
                                onCheckedChange={v => updateCard(originalIndex, { isSpecial: !!v })}
                              />
                              <span className="text-[10px] text-muted-foreground">Special</span>
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeCard(originalIndex)} className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive">
                              <X className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Row 2 for Chain: prerequisite cards from same skill */}
                          {card.tag === 'Chain' && (
                            <div className="ml-5">
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-chain)] block mb-1.5">
                                Requires cards (same skill):
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {siblingCards.map(sibling => {
                                  const isRequired = (card.requiresCards ?? []).includes(sibling.name);
                                  return (
                                    <button
                                      key={sibling.name}
                                      type="button"
                                      onClick={() => {
                                        const current = card.requiresCards ?? [];
                                        const next = isRequired
                                          ? current.filter(n => n !== sibling.name)
                                          : [...current, sibling.name];
                                        updateCard(originalIndex, { requiresCards: next.length > 0 ? next : undefined });
                                      }}
                                      className={cn(
                                        'rounded-md border px-2 py-0.5 text-[10px] font-medium transition-all',
                                        isRequired
                                          ? 'border-[var(--color-chain)]/50 bg-[var(--color-chain)]/10 text-[var(--color-chain)]'
                                          : 'border-border/50 text-muted-foreground hover:border-[var(--color-chain)]/30',
                                      )}
                                    >
                                      {sibling.name}
                                    </button>
                                  );
                                })}
                                {siblingCards.length === 0 && (
                                  <span className="text-[10px] text-muted-foreground">No other cards to chain with yet</span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Row 2 for Combo: required skill */}
                          {card.tag === 'Combo' && (
                            <div className="ml-5 flex items-center gap-2">
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-combo)] shrink-0">
                                Requires skill:
                              </span>
                              <Select
                                value={card.requiredSkillId ?? '_none'}
                                onValueChange={v => updateCard(originalIndex, { requiredSkillId: v === '_none' ? undefined : v })}
                              >
                                <SelectTrigger className="h-7 text-xs flex-1 max-w-[280px]">
                                  <SelectValue placeholder="Select skill..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="_none">
                                    <span className="text-muted-foreground">None</span>
                                  </SelectItem>
                                  {data.skills
                                    .filter(s => s.id !== (form.id || skillId))
                                    .map(s => (
                                      <SelectItem key={s.id} value={s.id}>
                                        <span className="flex items-center gap-2">
                                          <SkillIcon skill={s} size={16} />
                                          {s.name}
                                          <span className="text-muted-foreground text-[10px]">({s.type})</span>
                                        </span>
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                              {comboSkill && (
                                <SkillIcon skill={comboSkill} size={20} />
                              )}
                            </div>
                          )}

                          {/* Expanded: description */}
                          {isCardExpanded && (
                            <div className="mt-2 ml-5 space-y-3">
                              <FormField label="Description">
                                <Textarea
                                  value={card.description}
                                  onChange={e => updateCard(originalIndex, { description: e.target.value })}
                                  rows={2}
                                  className="text-xs"
                                  placeholder="What this card does..."
                                />
                              </FormField>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    <Button type="button" variant="outline" size="sm" onClick={() => addCard(tier)} className="gap-1 text-xs">
                      <Plus className="h-3 w-3" /> Add Tier {tier} Card
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save'}
        </Button>
        <Button variant="outline" onClick={() => navigate('/admin/skills')}>Cancel</Button>
      </div>
    </div>
  );
}
