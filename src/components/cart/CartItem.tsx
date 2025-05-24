
"use client";

import Image from 'next/image';
import type { CartItem as CartItemType } from '@/types';
import { Button } from '@/components/ui/button';
import { X, Minus, Plus } from 'lucide-react';
import Link from 'next/link';

interface CartItemProps {
  item: CartItemType;
  onRemove: (productId: string) => void;
  onQuantityChange: (productId: string, quantity: number) => void;
}

export function CartItem({ item, onRemove, onQuantityChange }: CartItemProps) {

  // Calculando o total do item - preço unitário * quantidade
  const itemTotal = item.price * item.quantity;

  // Função para diminuir a quantidade com feedback imediato
  const handleDecrease = () => {
    if (item.quantity > 1) {
      console.log('Diminuindo quantidade:', item.id, 'de', item.quantity, 'para', item.quantity - 1);
      // Atualiza imediatamente a UI para feedback rápido
      const newQuantity = item.quantity - 1;
      onQuantityChange(item.id, newQuantity);
    } else {
      console.log('Removendo item:', item.id);
      onRemove(item.id);
    }
  };

  // Função para aumentar a quantidade com feedback imediato
  const handleIncrease = () => {
    const newQuantity = item.quantity + 1;
    const maxStock = item.stock || 99; // Valor padrão se stock não estiver definido
    
    if (item.quantity < maxStock) {
      console.log('Aumentando quantidade:', item.id, 'de', item.quantity, 'para', newQuantity);
      onQuantityChange(item.id, newQuantity);
    }
  };

  return (
    <div className="flex items-center space-x-4 p-4 border-b border-border/40 bg-card/50 rounded-lg mb-4">
      <Link href={`/products/${item.id}`} className="shrink-0">
        <Image
          src={item.imageUrl}
          alt={item.name}
          width={80}
          height={80}
          className="rounded-md object-cover aspect-square"
          data-ai-hint={item.dataAiHint || "product image"}
        />
      </Link>
      <div className="flex-grow">
        <Link href={`/products/${item.id}`}>
          <h3 className="text-lg font-semibold font-orbitron hover:text-primary transition-colors">{item.name}</h3>
        </Link>
        <p className="text-sm text-muted-foreground">Unit Price: ${item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center space-x-3">
        <div className="flex items-center h-9 rounded-md border border-muted bg-black text-foreground">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-full px-3 rounded-r-none hover:bg-muted disabled:opacity-50"
            onClick={handleDecrease}
            disabled={item.quantity <= 1 && false} // Removido a desativação para permitir remover
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span
            className="px-3 text-sm font-medium min-w-[2.5rem] text-center tabular-nums"
            aria-live="polite"
          >
            {item.quantity}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-full px-3 rounded-l-none hover:bg-muted disabled:opacity-50"
            onClick={handleIncrease}
            disabled={item.quantity >= (item.stock || 99)} // Valor máximo padrão se stock não estiver definido
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-md font-semibold w-24 text-right">
          ${itemTotal.toFixed(2)}
        </p>
      </div>
      <Button variant="ghost" size="icon" onClick={() => onRemove(item.id)} aria-label={`Remove ${item.name} from cart`}>
        <X className="h-5 w-5 text-destructive hover:text-destructive/80" />
      </Button>
    </div>
  );
}
