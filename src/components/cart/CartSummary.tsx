"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Trash2 } from 'lucide-react';

interface CartSummaryProps {
  totalPrice: number;
  itemCount: number;
  onClearCart: () => void;
}

export function CartSummary({ totalPrice, itemCount, onClearCart }: CartSummaryProps) {
  // Formatando o preço total para exibição
  const formattedPrice = totalPrice.toFixed(2);
  
  // Log para depurar o cálculo do preço total
  console.log(`CartSummary: Preço total recebido: $${formattedPrice} para ${itemCount} itens`);
  
  return (
    <Card className="shadow-lg bg-card sticky top-20">
      <CardHeader>
        <CardTitle className="text-2xl font-orbitron">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Items ({itemCount})</span>
          <span>${formattedPrice}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping & Handling</span>
          <span>Calculated at Checkout</span>
        </div>
        {/* Add discount codes, taxes etc. here if needed */}
        <div className="flex justify-between font-bold text-lg pt-2 border-t border-border/40">
          <span>Order Total</span>
          <span>${formattedPrice}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3">
        <Link href="/checkout" className="w-full" passHref>
          <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={itemCount === 0}>
            Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Button variant="outline" onClick={onClearCart} className="w-full" disabled={itemCount === 0}>
         <Trash2 className="mr-2 h-4 w-4"/> Clear Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
