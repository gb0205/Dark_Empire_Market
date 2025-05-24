
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockOrders } from "@/lib/mock-data";
import type { Order, OrderItem as OrderItemType } from "@/types";
import { Eye, Edit, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const orderStatuses: Order['status'][] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingOrderStatus, setEditingOrderStatus] = useState<Order['status'] | ''>('');

  const { toast } = useToast();

  useEffect(() => {
    setTimeout(() => {
      setOrders(mockOrders);
      setIsLoading(false);
    }, 500);
  }, []);

  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 'default';
      case 'Processing': return 'secondary';
      case 'Shipped': return 'default';
      case 'Delivered': return 'default';
      case 'Cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusColorClass = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500 hover:bg-yellow-600 text-black';
      case 'Processing': return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'Shipped': return 'bg-indigo-500 hover:bg-indigo-600 text-white';
      case 'Delivered': return 'bg-green-500 hover:bg-green-600 text-white';
      case 'Cancelled': return 'bg-red-600 hover:bg-red-700 text-destructive-foreground';
      default: return 'bg-muted hover:bg-muted/80';
    }
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setEditingOrderStatus(order.status);
    setIsEditModalOpen(true);
  };

  const handleStatusChange = (newStatus: Order['status']) => {
    if (selectedOrder) {
      setOrders(prevOrders =>
        prevOrders.map(o =>
          o.id === selectedOrder.id ? { ...o, status: newStatus } : o
        )
      );
      toast({
        title: "Order Status Updated",
        description: `Status for order #${selectedOrder.id.substring(0,8)} changed to ${newStatus}.`,
      });
      setIsEditModalOpen(false);
      setSelectedOrder(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Imperial Requisitions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-orbitron font-bold text-primary">Order Management</h1>
      <p className="text-muted-foreground">
        Oversee all requisitions and their current status within the Empire. (Currently using mock data)
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Imperial Requisitions</CardTitle>
          <CardDescription>Listing all known orders.</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 && !isLoading ? (
            <p className="text-center text-muted-foreground py-10">
              No requisitions found in the Imperial Archives.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id.substring(0,8)}...</TableCell>
                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                    <TableCell>{order.userId.substring(0,8)}...</TableCell>
                    <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(order.status)} className={getStatusColorClass(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleViewOrder(order)} aria-label="View Order Details">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleEditOrder(order)} aria-label="Edit Order Status">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Order Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-lg bg-card">
          <DialogHeader>
            <DialogTitle className="font-orbitron text-primary">Order Details: #{selectedOrder?.id.substring(0,8)}...</DialogTitle>
            <DialogDescription>
              Detailed information for the selected requisition.
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <p><strong>Order ID:</strong> {selectedOrder.id}</p>
              <p><strong>Date:</strong> {new Date(selectedOrder.date).toLocaleString()}</p>
              <p><strong>Customer ID:</strong> {selectedOrder.userId}</p>
              <p><strong>Status:</strong> <Badge variant={getStatusVariant(selectedOrder.status)} className={getStatusColorClass(selectedOrder.status)}>{selectedOrder.status}</Badge></p>
              
              <Separator className="my-3" />
              <h4 className="font-semibold">Shipping Address:</h4>
              <p>{selectedOrder.shippingAddress.street}</p>
              <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
              <p>{selectedOrder.shippingAddress.country}</p>
              
              <Separator className="my-3" />
              <h4 className="font-semibold">Items:</h4>
              <ul className="space-y-2">
                {selectedOrder.items.map((item: OrderItemType) => (
                  <li key={item.productId} className="flex justify-between border-b border-border/40 pb-1">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>@ ${item.price.toFixed(2)} each</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <Separator className="my-3" />
              <p className="text-lg font-bold text-right">Total Amount: <span className="text-primary">${selectedOrder.totalAmount.toFixed(2)}</span></p>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Order Status Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md bg-card">
          <DialogHeader>
            <DialogTitle className="font-orbitron text-primary">Edit Order Status: #{selectedOrder?.id.substring(0,8)}...</DialogTitle>
            <DialogDescription>
              Update the current status for this Imperial requisition.
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 py-4">
              <p><strong>Order ID:</strong> {selectedOrder.id}</p>
              <p><strong>Current Status:</strong> <Badge variant={getStatusVariant(selectedOrder.status)} className={getStatusColorClass(selectedOrder.status)}>{selectedOrder.status}</Badge></p>
              <div>
                <Label htmlFor="orderStatus" className="text-foreground">New Status:</Label>
                <Select
                  value={editingOrderStatus}
                  onValueChange={(value) => setEditingOrderStatus(value as Order['status'])}
                >
                  <SelectTrigger id="orderStatus" className="w-full mt-1">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    {orderStatuses.map(status => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              type="button" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => handleStatusChange(editingOrderStatus as Order['status'])}
              disabled={!editingOrderStatus || editingOrderStatus === selectedOrder?.status}
            >
              Save Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
