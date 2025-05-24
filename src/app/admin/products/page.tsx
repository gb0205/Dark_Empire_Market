
"use client";

import React, { useState, useEffect } from 'react'; // Added React for type safety with JSX
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockProducts } from "@/lib/mock-data";
import type { Product } from "@/types";
import { PlusCircle, Edit, Trash2, Loader2 } from "lucide-react"; // Added Loader2
import NextImage from 'next/image'; // Renamed to avoid conflict with HTMLImageElement
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger, // Added AlertDialogTrigger here
} from "@/components/ui/alert-dialog";
import { ProductForm, type ProductFormValues } from '@/components/admin/ProductForm';
import { useToast } from '@/hooks/use-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching products if this were a real backend
    setProducts(mockProducts); 
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  const handleOpenModal = (product: Product | null = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleFormSubmit = (data: ProductFormValues) => {
    // data.imageUrl will now be the URL from Firebase Storage if a new image was uploaded,
    // or the existing/placeholder URL otherwise.
    if (editingProduct) {
      setProducts(prevProducts =>
        prevProducts.map(p =>
          p.id === editingProduct.id ? { ...p, ...data, price: Number(data.price), stock: Number(data.stock), imageUrl: data.imageUrl || p.imageUrl } : p
        )
      );
      toast({ title: "Product Updated", description: `${data.name} has been successfully updated.` });
    } else {
      const newProduct: Product = {
        ...data,
        id: `prod-${Date.now()}`,
        price: Number(data.price),
        stock: Number(data.stock),
        imageUrl: data.imageUrl || 'https://placehold.co/600x400.png', // Ensure imageUrl has a value
        dataAiHint: data.name.toLowerCase().split(' ').slice(0,2).join(' ') || 'product',
      };
      setProducts(prevProducts => [newProduct, ...prevProducts]);
      toast({ title: "Product Added", description: `${newProduct.name} has been successfully added.` });
    }
    handleCloseModal();
  };

  const handleDeleteProduct = () => {
    if (productToDelete) {
      setProducts(prevProducts => prevProducts.filter(p => p.id !== productToDelete.id));
      toast({ title: "Product Deleted", description: `${productToDelete.name} has been removed.`, variant: "destructive" });
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-orbitron font-bold text-primary">Product Arsenal</h1>
          <p className="text-muted-foreground">
            Manage all weaponry, artifacts, and essentials available in the Dark Empire Market.
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={(open) => {
            if (!open) handleCloseModal();
            else setIsModalOpen(open);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => handleOpenModal()}>
              <PlusCircle className="mr-2 h-5 w-5" />
              Add New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-card">
            <DialogHeader>
              <DialogTitle className="font-orbitron text-primary">
                {editingProduct ? 'Edit Imperial Asset' : 'Add New Asset to Arsenal'}
              </DialogTitle>
              <DialogDescription>
                {editingProduct ? `Modifying details for ${editingProduct.name}.` : 'Provide the specifications for the new asset, including an image.'}
              </DialogDescription>
            </DialogHeader>
            <ProductForm
              onSubmit={handleFormSubmit}
              initialData={editingProduct}
              onCancel={handleCloseModal}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Listing</CardTitle>
          <CardDescription>View, edit, or remove products from the Imperial inventory.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <NextImage // Use renamed import
                      src={product.imageUrl || "https://placehold.co/48x48.png"} // Fallback for missing URL
                      alt={product.name}
                      width={48}
                      height={48}
                      className="h-12 w-12 object-cover rounded-md"
                      data-ai-hint={product.dataAiHint || "product image"}
                      unoptimized={product.imageUrl?.startsWith('blob:')} // Prevent optimization for blob URLs (local previews)
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleOpenModal(product)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" onClick={() => setProductToDelete(product)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-card">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-orbitron text-destructive">Confirm Deletion</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove the asset "{productToDelete?.name}" from the Imperial inventory? This action cannot be undone (for this session).
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setProductToDelete(null)}>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteProduct}
                            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                          >
                            Delete Asset
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {products.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No products found in the Imperial Archives. Time to stock up.
        </p>
      )}
    </div>
  );
}

    
