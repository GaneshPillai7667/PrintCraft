import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { ReactNode } from 'react';

type Props = {
  title: string;
  subtitle?: string;
  className?: string;
  children: ReactNode;
};

export default function GlassCard({ title, subtitle, className, children }: Props) {
  return (
    <motion.section
      className={clsx('glass card-border rounded-2xl p-5 shadow-glow md:p-6', className)}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}>
      <header className="mb-4">
        <h3 className="font-heading text-base tracking-[0.08em] text-cyan-100 md:text-lg">{title}</h3>
        {subtitle ? <p className="mt-1 text-xs text-slate-400 md:text-sm">{subtitle}</p> : null}
      </header>
      {children}
    </motion.section>
  );
}
