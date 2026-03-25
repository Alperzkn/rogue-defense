import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-sm border px-2 py-0.5 text-[10px] font-bold tracking-wider transition-colors',
  {
    variants: {
      variant: {
        default: 'border-primary/40 bg-primary/10 text-primary',
        secondary: 'border-border bg-secondary text-muted-foreground',
        outline: 'border-border text-foreground',
        // Skill types
        fire: 'border-[#FF4500]/50 bg-[#FF4500]/10 text-[#FF4500]',
        electric: 'border-[#FFD700]/50 bg-[#FFD700]/10 text-[#FFD700]',
        energy: 'border-[#B44FFF]/50 bg-[#B44FFF]/10 text-[#B44FFF]',
        physical: 'border-[#3B82F6]/50 bg-[#3B82F6]/10 text-[#3B82F6]',
        field: 'border-[#00FF88]/50 bg-[#00FF88]/10 text-[#00FF88]',
        // Card tags
        chain: 'border-[#00C8FF]/50 bg-[#00C8FF]/10 text-[#00C8FF]',
        combo: 'border-[#FF6B9D]/50 bg-[#FF6B9D]/10 text-[#FF6B9D]',
        // Rarities
        mythic: 'border-[#FFD700]/50 bg-[#FFD700]/10 text-[#FFD700]',
        epic: 'border-[#A855F7]/50 bg-[#A855F7]/10 text-[#A855F7]',
        rare: 'border-[#3B82F6]/50 bg-[#3B82F6]/10 text-[#3B82F6]',
        common: 'border-[#6B7280]/30 bg-[#6B7280]/10 text-[#6B7280]',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
