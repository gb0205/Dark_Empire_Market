import type { Order, OrderItem as OrderItemType } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, CalendarDays, MapPin, ListOrdered } from 'lucide-react';

interface OrderHistoryItemProps {
  order: Order;
}

const OrderItem = ({ item }: { item: OrderItemType }) => (
  <div className="flex justify-between items-center py-2">
    <div>
      <p className="font-medium">{item.name}</p>
      <p className="text-sm text-muted-foreground">Qty: {item.quantity} @ ${item.price.toFixed(2)}</p>
    </div>
    <p className="font-semibold">${(item.quantity * item.price).toFixed(2)}</p>
  </div>
);

export function OrderHistoryItem({ order }: OrderHistoryItemProps) {
  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 'default';
      case 'Processing': return 'secondary';
      case 'Shipped': return 'default'; // Should be a distinct color, e.g., blue
      case 'Delivered': return 'default'; // Should be green
      case 'Cancelled': return 'destructive';
      default: return 'outline';
    }
  };
  
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'Processing': return 'bg-blue-500 hover:bg-blue-600';
      case 'Shipped': return 'bg-indigo-500 hover:bg-indigo-600';
      case 'Delivered': return 'bg-green-500 hover:bg-green-600';
      case 'Cancelled': return 'bg-red-600 hover:bg-red-700 text-destructive-foreground';
      default: return 'bg-muted hover:bg-muted/80';
    }
  }


  return (
    <Card className="mb-6 shadow-md bg-card">
      <CardHeader className="flex flex-row justify-between items-start space-x-4 pb-3">
        <div>
          <CardTitle className="text-xl font-orbitron">Order #{order.id.substring(0,8)}...</CardTitle>
          <CardDescription className="flex items-center text-sm">
            <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
            Placed on: {new Date(order.date).toLocaleDateString()}
          </CardDescription>
        </div>
        <Badge variant="default" className={`text-xs whitespace-nowrap ${getStatusColor(order.status)}`}>
          {order.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2 flex items-center"><ListOrdered className="h-4 w-4 mr-2 text-accent"/>Items Procured:</h4>
          <div className="max-h-48 overflow-y-auto space-y-1 pr-2">
            {order.items.map((item, index) => (
              <OrderItem key={`${item.productId}-${index}`} item={item} />
            ))}
          </div>
        </div>
        <Separator className="my-3" />
        <div className="text-sm">
          <p className="flex items-center mb-1">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <strong>Shipping To:</strong> {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 p-4 flex justify-between items-center border-t">
        <p className="text-lg font-semibold">Total: ${order.totalAmount.toFixed(2)}</p>
        {/* <Button variant="outline" size="sm">View Details / Track</Button> */}
      </CardFooter>
    </Card>
  );
}
