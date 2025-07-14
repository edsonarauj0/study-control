// ResponsiveCard.tsx

import React from 'react';
import classNames from 'classnames';

interface ResponsiveCardProps {
  children: React.ReactNode;
  size?:
    | '1x1'
    | '2x1'
    | '3x1'
    | '4x1'
    | '5x1'
    | '6x1'
    | 'full';
  rows?: 1 | 2 | 3 | 4 | 5 | 6; // Tipagem mais estrita é uma boa prática
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

// Mapeamento de colunas
const sizeClasses: Record<string, string> = {
  '1x1': 'col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1',
  '2x1': 'col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2',
  '3x1': 'col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-3',
  '4x1': 'col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4',
  '5x1': 'col-span-1 sm:col-span-3 md:col-span-4 lg:col-span-5',
  '6x1': 'col-span-1 sm:col-span-3 md:col-span-6 lg:col-span-6',
  'full': 'col-span-full',
};

// ✅ NOVO: Mapeamento para as linhas (rows)
const rowSpanClasses: Record<number, string> = {
  1: 'row-span-1',
  2: 'row-span-2',
  3: 'row-span-3',
  4: 'row-span-4',
  5: 'row-span-5',
  6: 'row-span-6',
};

const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
  children,
  size = '6x1',
  rows,
  compact = false,
  className,
  style,
}) => {
  return (
    <div
      className={classNames(
        compact
          ? 'bg-white rounded shadow flex items-center justify-center p-2 h-[50px] overflow-hidden'
          : 'bg-white rounded shadow flex flex-col min-h-[80px] p-4',
        sizeClasses[size],
        // ✅ ATUALIZADO: Use o objeto de mapeamento
        rows ? rowSpanClasses[rows] : '',
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
};

export default ResponsiveCard;