
"use client"; // This page uses client-side hooks (useCart, useState)

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { mockProducts } from '@/lib/mock-data';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, CheckCircle, AlertTriangle, Package, Minus, Plus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { notFound, useParams } from 'next/navigation';
import { Label } from '@/components/ui/label';

// Simulate fetching a single product
async function getProductById(id: string): Promise<Product | undefined> {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProducts.find(p => p.id === id));
    }, 100);
  });
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [product, setProduct] = useState<Product | null | undefined>(undefined); // undefined for loading, null for not found
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    if (id) {
      getProductById(id).then(data => {
        if (data) {
          setProduct(data);
          setQuantity(1); // Reset quantity when product loads
        } else {
          setProduct(null); // Mark as not found
        }
      });
    }
  }, [id]);

  if (product === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin border-t-primary"></div>
        <p className="text-lg text-muted-foreground ml-4">Loading product details from the Imperial Archives...</p>
      </div>
    );
  }

  if (product === null) {
    notFound(); // This will render the nearest not-found.tsx or Next.js default 404 page
    return null; 
  }
  
  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
    }
  };

  const subtotal = product.price * quantity;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card className="overflow-hidden shadow-xl bg-card">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative aspect-square md:aspect-auto">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              data-ai-hint={product.dataAiHint || "product image"}
            />
          </div>
          <div className="flex flex-col">
            <CardHeader className="p-6">
              <CardTitle className="text-3xl font-orbitron mb-2">{product.name}</CardTitle>
              <Badge variant="outline" className="w-fit text-sm mb-2">{product.category}</Badge>
              <CardDescription className="text-base text-foreground/80 leading-relaxed">
                {product.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex-grow">
              <p className="text-3xl font-semibold text-primary mb-4">${product.price.toFixed(2)}</p>
              
              <div className="flex items-center space-x-2 mb-4">
                {product.stock > 0 ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-green-400">{product.stock > 5 ? "In Stock" : `Low Stock (${product.stock} left)`}</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <span className="text-sm text-destructive">Out of Stock</span>
                  </>
                )}
              </div>

              <Separator className="my-4" />

              <div className="flex items-center space-x-2">
                <Label htmlFor="quantity-value" className="text-sm font-medium shrink-0">Quantity:</Label>
                <div className="flex items-center h-9 rounded-md border border-muted bg-black text-foreground">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-full px-3 rounded-r-none hover:bg-muted disabled:opacity-50"
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    disabled={quantity <= 1 || product.stock === 0}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span
                    id="quantity-value"
                    className="px-3 text-sm font-medium min-w-[2.5rem] text-center tabular-nums"
                    aria-live="polite"
                  >
                    {quantity}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-full px-3 rounded-l-none hover:bg-muted disabled:opacity-50"
                    onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                    disabled={quantity >= product.stock || product.stock === 0}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {product.stock > 0 && (
                <div className="mt-4">
                  <p className="text-xl font-semibold">
                    Subtotal: <span className="text-primary">${subtotal.toFixed(2)}</span>
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="p-6 border-t border-border/40">
              <Button 
                size="lg" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                aria-label={`Add ${product.name} to cart`}
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>

      <section className="mt-12">
        <h3 className="text-2xl font-orbitron font-semibold mb-4">Product Specifications</h3>
        <Card className="bg-card/50">
          <CardContent className="p-6 space-y-2 text-foreground/80">
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Availability:</strong> {product.stock > 0 ? `${product.stock} units` : "Currently Unavailable"}</p>
            <p><strong>Imperial Approval:</strong> <Badge variant={product.stock > 0 ? "default": "destructive"} className="bg-green-600 hover:bg-green-700">Confirmed</Badge></p>
            <p className="flex items-center"><Package className="mr-2 h-4 w-4 text-accent"/> Ships from the Outer Rim territories.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
