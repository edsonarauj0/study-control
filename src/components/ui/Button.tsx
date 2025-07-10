import { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md bg-blue-500 px-3 py-1 text-sm font-medium text-white hover:bg-blue-600 ${className}`}
      {...props}
    />
  );
}
