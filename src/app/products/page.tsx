"use client";

import { useState } from 'react';
import { ProductList } from '@/components/product/ProductList';
import { mockProducts } from '@/lib/mock-data';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator'; 
import { LayoutGrid } from 'lucide-react'; 

// Simulate fetching products (can be kept as is, or refactored if real API is used later)
async function getProducts(): Promise<Product[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProducts);
    }, 100); 
  });
}

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>(mockProducts); 
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(allProducts.map(p => p.category))).sort();

  const filteredProducts = selectedCategory
    ? allProducts.filter(product => product.category === selectedCategory)
    : allProducts;

  return (
    <> 
      <section className="text-center py-8 mb-4"> 
        <h1 className="text-4xl font-orbitron font-bold text-primary mb-3">Our Imperial Inventory</h1>
        <p className="text-lg text-foreground/80 max-w-xl mx-auto">
          Browse the finest selection of goods, technology, and artifacts approved by the Galactic Empire. 
          Only the best for those who serve.
        </p>
      </section>

      <div className="mt-8 mb-8"> 
        <div className="flex flex-wrap justify-center gap-2 items-center mb-2">
          <LayoutGrid className="h-5 w-5 text-accent mr-2 hidden sm:inline-block" />
          <h2 className="text-xl font-orbitron font-semibold text-accent mr-2">Filter by Category:</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(null)}
            className={`transition-all duration-200 ease-in-out ${selectedCategory === null ? 'bg-primary text-primary-foreground scale-105' : 'border-accent text-accent hover:bg-accent/10'}`}
          >
            All Categories
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className={`transition-all duration-200 ease-in-out ${selectedCategory === category ? 'bg-primary text-primary-foreground scale-105' : 'border-accent text-accent hover:bg-accent/10'}`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      
      <Separator className="my-4 border-border/60" /> {/* Alterado de my-8 para my-4 */}

      <ProductList products={filteredProducts} />
    </>
  );
}
