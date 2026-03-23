import React from 'react';
import { motion } from 'framer-motion';
import { Colors, Radius } from '../theme';

interface GlowCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  glowColor?: string;
  onPress?: () => void;
}

export function GlowCard({ children, style, glowColor = Colors.cyan, onPress }: GlowCardProps) {
  return (
    <motion.div
      whileHover={onPress ? { scale: 1.01, boxShadow: `0 0 24px ${glowColor}40` } : undefined}
      whileTap={onPress ? { scale: 0.985 } : undefined}
      onClick={onPress}
      style={{
        backgroundColor: Colors.bgCard,
        borderRadius: Radius.md,
        border: `1px solid ${glowColor}28`,
        boxShadow: `0 0 10px ${glowColor}18`,
        cursor: onPress ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${Colors.bgElevated}, ${Colors.bgCard})`,
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}
