import type { ComponentPropsWithoutRef } from 'react';

const baseClassName =
  'cursor-pointer inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-sm shadow-slate-900/5 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950';

type SoftButtonProps = ComponentPropsWithoutRef<'button'> & {
  className?: string;
};

export function SoftButton({ className = '', children, type = 'button', ...props }: SoftButtonProps) {
  return (
    <button {...props} type={type} className={`${baseClassName} ${className}`.trim()}>
      {children}
    </button>
  );
}
