import { SVGProps } from 'react';

export function HomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M3 10.5L12 3l9 7.5v10.5a1 1 0 0 1-1 1h-5v-5h-6v5H4a1 1 0 0 1-1-1V10.5z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ListIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function UserIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="12" cy="7" r="4" strokeWidth="2" />
      <path d="M5 21v-1a7 7 0 0 1 14 0v1" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function CogIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="12" cy="12" r="3" strokeWidth="2" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
