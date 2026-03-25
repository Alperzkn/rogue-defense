import type { ReactNode } from 'react';
import { Label } from '../../components/ui/label';

export function FormField({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}
