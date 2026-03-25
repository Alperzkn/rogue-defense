import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary/10 text-primary',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        outline: 'border-border text-muted-foreground',
        destructive: 'border-transparent bg-destructive/10 text-destructive',
        fire: 'border-[var(--color-fire)]/20 bg-[var(--color-fire)]/10 text-[var(--color-fire)]',
        electric: 'border-[var(--color-electric)]/20 bg-[var(--color-electric)]/10 text-[var(--color-electric)]',
        energy: 'border-[var(--color-energy)]/20 bg-[var(--color-energy)]/10 text-[var(--color-energy)]',
        physical: 'border-[var(--color-physical)]/20 bg-[var(--color-physical)]/10 text-[var(--color-physical)]',
        field: 'border-[var(--color-field)]/20 bg-[var(--color-field)]/10 text-[var(--color-field)]',
        chain: 'border-[var(--color-chain)]/20 bg-[var(--color-chain)]/10 text-[var(--color-chain)]',
        combo: 'border-[var(--color-combo)]/20 bg-[var(--color-combo)]/10 text-[var(--color-combo)]',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
