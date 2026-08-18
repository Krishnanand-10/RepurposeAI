import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'interactive';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-200';

  const variantStyles = {
    default: 'bg-zinc-900/90 border border-zinc-800 text-zinc-100',
    elevated: 'bg-zinc-900 border border-zinc-800/80 shadow-xl shadow-black/40 text-zinc-100',
    glass: 'bg-zinc-900/70 backdrop-blur-xl border border-zinc-800/80 text-zinc-100',
    interactive:
      'bg-zinc-900/90 border border-zinc-800 text-zinc-100 hover:border-zinc-700 hover:shadow-lg hover:shadow-indigo-500/5 cursor-pointer',
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};
