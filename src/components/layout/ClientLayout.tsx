"use client";

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="container mx-auto px-4 py-8"
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}
