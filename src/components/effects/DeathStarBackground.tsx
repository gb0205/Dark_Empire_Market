"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export function DeathStarBackground() {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    // Atraso pequeno para garantir que a renderização ocorra suavemente
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: loaded ? 0.04 : 0 // Opacidade muito baixa para ficar quase invisível
        }}
        transition={{ duration: 2 }}
      >
        <motion.div
          animate={{ 
            scale: [1, 1.02, 1],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut"
          }}
          className="relative w-[150vmin] h-[150vmin]" // Muito grande para preencher a tela
        >
          <Image
            src="/images/products/death-star.png" 
            alt="Death Star"
            fill
            className="object-contain"
            priority
            sizes="150vmin"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
