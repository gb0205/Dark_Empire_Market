import Link from 'next/link';
import { cn } from '@/lib/utils';

// Simplified Galactic Empire inspired SVG icon
const GalacticEmpireIcon = ({ className }: { className?: string }) => (
  <svg
    className={cn("h-8 w-8 fill-current", className)}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v2.14c1.72.45 3 2 3 3.86 0 2.21-1.79 4-4 4s-4-1.79-4-4c0-1.86 1.28-3.41 3-3.86V7zm1 7.5c1.38 0 2.5-1.12 2.5-2.5S13.38 9.5 12 9.5s-2.5 1.12-2.5 2.5 1.12 2.5 2.5 2.5z" />
  </svg>
);


export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors", className)}>
      <GalacticEmpireIcon className="h-8 w-8 text-primary" />
      <span className="text-2xl font-bold font-orbitron tracking-wider">
        Dark Empire Market
      </span>
    </Link>
  );
}
