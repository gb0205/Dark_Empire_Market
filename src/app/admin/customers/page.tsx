
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { mockUsers, mockOrders } from "@/lib/mock-data";
import type { User, Order } from "@/types";
import { Eye, Edit, Trash2, Loader2, UserSquare2, ListOrdered, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching customers
    setTimeout(() => {
      setCustomers(mockUsers.filter(u => !u.isAdmin)); // Filter out admin users from customer list
      setIsLoading(false);
    }, 500);
  }, []);

  const handleViewDossier = (customer: User) => {
    setSelectedCustomer(customer);
    // Simulate fetching customer's orders
    const orders = mockOrders.filter(order => order.userId === customer.id);
    setCustomerOrders(orders);
    setIsViewModalOpen(true);
  };

  const handleEditCustomer = (customer: User) => {
    toast({
      title: "Functionality Pending",
      description: `Editing dossier for ${customer.name} is not yet implemented.`,
      variant: "default"
    });
    // setSelectedCustomer(customer);
    // setIsEditModalOpen(true); // For when edit modal is ready
  };

  const handleDeleteCustomer = (customer: User) => {
     toast({
      title: "Functionality Pending",
      description: `Deleting subject ${customer.name} from Imperial records is not yet implemented.`,
      variant: "destructive"
    });
    // setCustomerToDelete(customer);
    // openDeleteConfirmDialog(); // For when delete confirm is ready
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Imperial Subject Files...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-orbitron font-bold text-primary">Customer Dossiers</h1>
      <p className="text-muted-foreground">
        Manage and view information about loyal (and disloyal) subjects of the Empire. (Currently using mock data)
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Registered Subjects</CardTitle>
          <CardDescription>Listing all known subjects within Imperial jurisdiction.</CardDescription>
        </CardHeader>
        <CardContent>
          {customers.length === 0 && !isLoading ? (
             <p className="text-center text-muted-foreground py-10">
              No subjects found in the Imperial Archives.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject ID</TableHead>
                  <TableHead>Designation (Name)</TableHead>
                  <TableHead>Holonet Email</TableHead>
                  <TableHead>Enlistment Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.id.substring(0,8)}...</TableCell>
                    <TableCell>{customer.name || 'N/A'}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.joinDate ? new Date(customer.joinDate).toLocaleDateString() : 'Unknown'}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleViewDossier(customer)} aria-label="View Dossier">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View Dossier</span>
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleEditCustomer(customer)} aria-label="Edit Subject">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit Subject</span>
                      </Button>
                       <Button variant="destructive" size="icon" onClick={() => handleDeleteCustomer(customer)} aria-label="Delete Subject">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete Subject</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Customer Dossier Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-lg bg-card">
          <DialogHeader>
            <DialogTitle className="font-orbitron text-primary flex items-center">
              <UserSquare2 className="mr-3 h-7 w-7" /> Subject Dossier: {selectedCustomer?.name}
            </DialogTitle>
            <DialogDescription>
              Detailed intelligence on subject {selectedCustomer?.id.substring(0,8)}...
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <h4 className="font-semibold text-lg">Subject Information:</h4>
              <p><strong>Subject ID:</strong> {selectedCustomer.id}</p>
              <p><strong>Designation:</strong> {selectedCustomer.name || 'Not Specified'}</p>
              <p><strong>Holonet Email:</strong> {selectedCustomer.email}</p>
              <p><strong>Enlistment Date:</strong> {selectedCustomer.joinDate ? new Date(selectedCustomer.joinDate).toLocaleString() : 'Unknown'}</p>
              
              <div className="flex items-center gap-2">
                <strong className="shrink-0">Avatar URL:</strong>
                {selectedCustomer.avatarUrl ? (
                  <Button variant="outline" size="sm" asChild>
                    <a href={selectedCustomer.avatarUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5">
                      View Avatar
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                ) : (
                  <span className="text-muted-foreground">Not Provided</span>
                )}
              </div>
              
              <Separator className="my-3" />
              <h4 className="font-semibold text-lg flex items-center"><ListOrdered className="mr-2 h-5 w-5 text-accent" />Requisition History ({customerOrders.length}):</h4>
              {customerOrders.length > 0 ? (
                <ul className="space-y-3">
                  {customerOrders.map((order: Order) => (
                    <li key={order.id} className="border-b border-border/40 pb-2">
                      <p><strong>Order ID:</strong> {order.id.substring(0,8)}... (<Badge variant={order.status === 'Delivered' ? 'default' : order.status === 'Cancelled' ? 'destructive' : 'secondary'} className={order.status === 'Delivered' ? 'bg-green-500 hover:bg-green-600' : order.status === 'Cancelled' ? '' : 'bg-blue-500 hover:bg-blue-600'}>{order.status}</Badge>)
                      </p>
                      <p className="text-sm"><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                      <p className="text-sm"><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>
                      <p className="text-sm"><strong>Items:</strong></p>
                      <ul className="list-disc list-inside pl-4 text-xs">
                        {order.items.map(item => (
                          <li key={item.productId}>{item.name} (x{item.quantity})</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No requisitions found for this subject.</p>
              )}
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Close Dossier</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Placeholder for Edit Customer Modal and Delete Confirmation if needed later */}

    </div>
  );
}
