
"use client";
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { motion } from 'framer-motion';
import { useState, type MouseEvent } from 'react';

interface ProductCardProps {
  product: Product;
}

const TILT_AMOUNT = 15; // Max tilt angle in degrees

const cardVariants = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleAddToCart = () => {
    addItem(product);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    setIsHovering(true);
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const deltaX = (x - centerX) / centerX; // -1 to 1
    const deltaY = (y - centerY) / centerY; // -1 to 1

    setRotate({
      x: -deltaY * TILT_AMOUNT, // Tilt up/down (top edge towards/away from user)
      y: deltaX * TILT_AMOUNT,  // Tilt left/right (left edge towards/away from user)
    });
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      transition={{ type: "spring", stiffness: 120, damping: 20, mass: 1 }}
      className="w-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px', // Added for 3D effect depth
        transformStyle: 'preserve-3d', // Ensures children are transformed in 3D space
      }}
    >
      <motion.div
        style={{
            rotateX: rotate.x,
            rotateY: rotate.y,
            scale: isHovering ? 1.05 : 1,
            y: isHovering ? -5 : 0,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.7 }} // Transition for the tilt effect itself
      >
        <Card className="w-full overflow-hidden shadow-lg hover:shadow-primary/30 transition-shadow duration-300 flex flex-col bg-card">
          <Link href={`/products/${product.id}`} passHref className="block group">
            <CardHeader className="p-0">
              <div className="aspect-[4/3] relative w-full overflow-hidden">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  data-ai-hint={product.dataAiHint || "product image"}
                />
              </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <CardTitle className="text-lg font-orbitron mb-1 truncate">{product.name}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground h-10 overflow-hidden text-ellipsis">
                {product.description}
              </CardDescription>
              <p className="text-xl font-semibold text-primary mt-2">${product.price.toFixed(2)}</p>
            </CardContent>
          </Link>
          <CardFooter className="p-4 border-t border-border/40 mt-auto">
            <motion.div whileTap={{ scale: 0.95 }} className="w-full">
              <Button
                onClick={handleAddToCart}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                aria-label={`Add ${product.name} to cart`}
              >
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
}
