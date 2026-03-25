import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { FormField } from './components/FormField';
import { StringListEditor } from './components/StringListEditor';
import { useGameData } from './hooks/useGameData';
import { useToast } from './components/Toast';
import { slugify } from '../lib/utils';
import type { StatusEffect } from '../data/types';

const empty: StatusEffect = { id: '', name: '', description: '', icon: '✨', color: '#00C8FF', sources: [] };

export function AdminStatusEffectEditor() {
  const { effectId } = useParams();
  const isNew = !effectId;
  const { data, saveStatusEffect } = useGameData();
  const navigate = useNavigate();
  const { toast } = useToast();

  const existing = data?.statusEffects.find(e => e.id === effectId);
  const [form, setForm] = useState<StatusEffect>(existing ?? { ...empty });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existing) setForm(existing);
  }, [existing]);

  const set = <K extends keyof StatusEffect>(key: K, value: StatusEffect[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!form.name.trim()) return toast('Name is required', 'error');
    const toSave = { ...form, id: isNew ? slugify(form.name) : form.id };
    setSaving(true);
    try {
      await saveStatusEffect(toSave, isNew);
      toast(isNew ? 'Status effect created' : 'Status effect saved');
      navigate('/admin/status-effects');
    } catch (err) {
      toast(String(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/status-effects')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-black tracking-tight text-foreground">
          {isNew ? 'New Status Effect' : `Edit: ${form.name}`}
        </h1>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Name">
            <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Burn" />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Icon (emoji)">
              <Input value={form.icon} onChange={e => set('icon', e.target.value)} placeholder="🔥" />
            </FormField>
            <FormField label="Color (hex)">
              <div className="flex gap-2">
                <div className="h-9 w-9 shrink-0 rounded-[var(--radius)] border border-border" style={{ backgroundColor: form.color }} />
                <Input value={form.color} onChange={e => set('color', e.target.value)} placeholder="#FF4500" />
              </div>
            </FormField>
          </div>
        </div>

        <FormField label="Description">
          <Textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="What this effect does..." />
        </FormField>

        <FormField label="Sources">
          <StringListEditor items={form.sources} onChange={v => set('sources', v)} placeholder="e.g. Flame Missile (Ignition card)" />
        </FormField>
      </div>

      <div className="mt-8 flex gap-3">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save'}
        </Button>
        <Button variant="outline" onClick={() => navigate('/admin/status-effects')}>Cancel</Button>
      </div>
    </div>
  );
}
