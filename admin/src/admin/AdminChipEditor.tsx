import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { FormField } from './components/FormField';
import { useGameData } from './hooks/useGameData';
import { useToast } from './components/Toast';
import type { ChipSocketData, ChipStat } from '../data/types';

export function AdminChipEditor() {
  const { socketId } = useParams();
  const { data, saveChipSocket } = useGameData();
  const navigate = useNavigate();
  const { toast } = useToast();

  const existing = data?.chipSockets.find(s => s.id === socketId);
  const [form, setForm] = useState<ChipSocketData | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existing) setForm({ ...existing, stats: existing.stats.map(s => ({ ...s })) });
  }, [existing]);

  if (!form) return null;

  const set = <K extends keyof ChipSocketData>(key: K, value: ChipSocketData[K]) =>
    setForm(prev => prev ? { ...prev, [key]: value } : prev);

  const updateStat = (index: number, patch: Partial<ChipStat>) => {
    const stats = [...form.stats];
    stats[index] = { ...stats[index], ...patch };
    set('stats', stats);
  };

  const removeStat = (index: number) => set('stats', form.stats.filter((_, i) => i !== index));
  const addStat = () => set('stats', [...form.stats, { description: '', chance: 1 }]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveChipSocket(form);
      toast('Chip socket saved');
      navigate('/admin/chips');
    } catch (err) {
      toast(String(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/chips')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-black tracking-tight" style={{ color: form.color }}>
          {form.icon} {form.name}
        </h1>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-4">
          <FormField label="Name">
            <Input value={form.name} onChange={e => set('name', e.target.value)} />
          </FormField>
          <FormField label="Icon (emoji)">
            <Input value={form.icon} onChange={e => set('icon', e.target.value)} />
          </FormField>
          <FormField label="Color (hex)">
            <div className="flex gap-2">
              <div className="h-9 w-9 shrink-0 rounded-[var(--radius)] border border-border" style={{ backgroundColor: form.color }} />
              <Input value={form.color} onChange={e => set('color', e.target.value)} />
            </div>
          </FormField>
        </div>

        <FormField label="Description">
          <Textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} />
        </FormField>

        {/* Stats */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-semibold text-foreground">Stats ({form.stats.length})</Label>
            <Button type="button" variant="outline" size="sm" onClick={addStat} className="gap-1">
              <Plus className="h-3 w-3" /> Add Stat
            </Button>
          </div>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
            {form.stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-2 rounded-md border border-border/50 bg-secondary/30 p-2">
                <Input
                  value={stat.description}
                  onChange={e => updateStat(i, { description: e.target.value })}
                  placeholder="Stat description"
                  className="flex-1 h-7 text-xs"
                />
                <Input
                  type="number"
                  value={stat.chance}
                  onChange={e => updateStat(i, { chance: parseFloat(e.target.value) || 0 })}
                  className="w-20 h-7 text-xs"
                  step="0.01"
                  min="0"
                />
                <span className="text-[10px] text-muted-foreground shrink-0">%</span>
                <div className="flex items-center gap-1 shrink-0">
                  <Checkbox
                    checked={!!stat.isUltraRare}
                    onCheckedChange={v => updateStat(i, { isUltraRare: !!v })}
                  />
                  <Star className={`h-3 w-3 ${stat.isUltraRare ? 'text-[#FFD700]' : 'text-muted-foreground/30'}`} />
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => removeStat(i)} className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save'}
        </Button>
        <Button variant="outline" onClick={() => navigate('/admin/chips')}>Cancel</Button>
      </div>
    </div>
  );
}
