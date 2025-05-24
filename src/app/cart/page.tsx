"use client";

import { useCart } from '@/contexts/CartContext';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice: contextTotalPrice, itemCount } = useCart();
  
  // Calcular o preço total manualmente para garantir que esteja correto
  const calculatedTotal = items.reduce((total, item) => {
    const itemTotal = item.price * item.quantity;
    console.log(`Página do carrinho - Item: ${item.name}, Quantidade: ${item.quantity}, Preço unitário: $${item.price.toFixed(2)}, Total do item: $${itemTotal.toFixed(2)}`);
    return total + itemTotal;
  }, 0);
  
  // Usar o valor calculado para garantir precisão
  const totalPrice = calculatedTotal;
  
  console.log(`Página do carrinho - Total calculado: $${totalPrice.toFixed(2)}, Total do contexto: $${contextTotalPrice.toFixed(2)}`);
  console.log(`Página do carrinho - Itens no carrinho:`, items);

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-orbitron font-bold mb-4">Your Imperial Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">
          Looks like you haven't added any items to your cart yet. <br/>
          The galaxy's finest wares await your command.
        </p>
        <Link href="/products" passHref>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-4xl font-orbitron font-bold mb-8 text-center text-primary">Your Imperial Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={removeItem}
              onQuantityChange={updateQuantity}
            />
          ))}
        </div>
        <div className="lg:col-span-1">
          <CartSummary totalPrice={totalPrice} itemCount={itemCount} onClearCart={clearCart} />
        </div>
      </div>
    </div>
  );
}
