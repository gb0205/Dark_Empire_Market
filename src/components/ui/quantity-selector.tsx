"use client";

import { Button } from './button';
import { Input } from './input';

interface QuantitySelectorProps {
  quantity: number;
  onChange: (newQuantity: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  label?: string;
  labelClassName?: string;
  className?: string;
}

export function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  label,
  labelClassName = "text-sm font-medium",
  className = "",
}: QuantitySelectorProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      onChange(Math.max(min, Math.min(value, max)));
    }
  };

  const decrementQuantity = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      {label && (
        <label htmlFor="quantity" className={labelClassName}>
          {label}
        </label>
      )}
      <div className="flex items-center">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-r-none border-r-0"
          onClick={decrementQuantity}
          disabled={disabled || quantity <= min}
          aria-label="Decrease quantity"
        >
          <span className="text-lg font-medium">-</span>
        </Button>
        <Input
          id="quantity"
          type="number"
          value={quantity}
          onChange={handleInputChange}
          min={min}
          max={max}
          className="w-12 h-9 text-center rounded-none border-x-0"
          disabled={disabled}
          aria-label="Quantity input"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-l-none border-l-0"
          onClick={incrementQuantity}
          disabled={disabled || quantity >= max}
          aria-label="Increase quantity"
        >
          <span className="text-lg font-medium">+</span>
        </Button>
      </div>
    </div>
  );
}
