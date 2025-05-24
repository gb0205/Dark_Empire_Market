
"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const NUM_STARS = 150; // Adjust for density/performance

interface StarProps {
  id: number;
  initialX: string;
  initialY: string;
  size: number;
  duration: number;
  delay: number;
}

export function HyperspaceBackground() {
  const [stars, setStars] = useState<StarProps[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars: StarProps[] = [];
      for (let i = 0; i < NUM_STARS; i++) {
        // Start stars from a smaller central area
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 50; // Pixels from center for starting point
        
        newStars.push({
          id: i,
          initialX: `calc(50% + ${Math.cos(angle) * radius}px)`,
          initialY: `calc(50% + ${Math.sin(angle) * radius}px)`,
          size: Math.random() * 2 + 0.5, // Star size 0.5px to 2.5px
          duration: Math.random() * 2 + 1, // Streak duration 1s to 3s
          delay: Math.random() * 3, // Stagger start times
        });
      }
      setStars(newStars);
    };
    generateStars();
  }, []);

  if (stars.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background pointer-events-none">
      {stars.map((star) => {
        // Calculate end points far outside the viewport
        const endXAngle = Math.random() * Math.PI * 2;
        // Ensure end point is far enough to streak across typical screen sizes
        const endRadius = Math.max(window.innerWidth, window.innerHeight) * 1.5; 
        const endX = `calc(50% + ${Math.cos(endXAngle) * endRadius}px)`;
        const endY = `calc(50% + ${Math.sin(endXAngle) * endRadius}px)`;

        return (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-gray-400"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              left: star.initialX,
              top: star.initialY,
              // For a streak effect, make stars elongated along their path
              // This can be faked by scaling or using a rectangular div
              // For simplicity, we use small dots that move fast
            }}
            initial={{
              opacity: 0,
              scale: 0.5,
              x: '-50%', // Center the star's own transform origin
              y: '-50%',
            }}
            animate={{
              opacity: [0, 0.8, 0], // Fade in, stay visible, fade out
              x: [`-50%`, `calc(${endX} - ${star.initialX} - 50%)`], // Adjust for absolute positioning
              y: [`-50%`, `calc(${endY} - ${star.initialY} - 50%)`],
              scale: [0.5, 1 + star.size / 2, 0.1], // Grow slightly then shrink
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              repeatType: 'loop', // 'loop' will restart the animation from initial
              ease: 'linear',
            }}
          />
        );
      })}
    </div>
  );
}
