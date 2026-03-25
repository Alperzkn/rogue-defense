import { Plus, X } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

interface Props {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

export function StringListEditor({ items, onChange, placeholder = 'Add item...' }: Props) {
  const update = (index: number, value: string) => {
    const next = [...items];
    next[index] = value;
    onChange(next);
  };
  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));
  const add = () => onChange([...items, '']);

  return (
    <div className="space-y-1.5">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={item}
            onChange={e => update(i, e.target.value)}
            placeholder={placeholder}
            className="flex-1"
          />
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)} className="shrink-0 text-muted-foreground hover:text-destructive">
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add} className="gap-1">
        <Plus className="h-3 w-3" /> Add
      </Button>
    </div>
  );
}
