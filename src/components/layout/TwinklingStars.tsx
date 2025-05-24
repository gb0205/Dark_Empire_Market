
"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Star {
  id: number;
  x: string;
  y: string;
  size: string;
  initialOpacity: number;
  animationDuration: number;
  animationDelay: number;
}

const NUM_STARS = 150; 

interface TwinklingStarsProps {
  className?: string;
}

export function TwinklingStars({ className }: TwinklingStarsProps) {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = [];
      for (let i = 0; i < NUM_STARS; i++) {
        newStars.push({
          id: i,
          x: `${Math.random() * 100}%`,
          y: `${Math.random() * 100}%`,
          size: `${Math.random() * 1 + 0.5}px`, // Range 0.5px to 1.5px (smaller and more subtle)
          initialOpacity: Math.random() * 0.3 + 0.1, // Range 0.1 to 0.4 (fainter)
          animationDuration: Math.random() * 1.5 + 1.0, // Twinkle duration: 1.0s to 2.5s
          animationDelay: Math.random() * 2.0, 
        });
      }
      setStars(newStars);
    };
    generateStars();
    // No need to regenerate on NUM_STARS change unless it's dynamic
  }, []);

  if (stars.length === 0) {
    return null; 
  }

  return (
    <div
      className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-gray-400" // Slightly darker gray for subtlety
          style={{
            left: star.x,
            top: star.y,
            width: star.size,
            height: star.size,
            opacity: star.initialOpacity,
          }}
          animate={{
            // Twinkle to 50% of initial opacity and back, making it very subtle
            opacity: [star.initialOpacity, star.initialOpacity * 0.5, star.initialOpacity], 
          }}
          transition={{
            duration: star.animationDuration,
            delay: star.animationDelay,
            repeat: Infinity,
            repeatType: 'mirror', 
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
