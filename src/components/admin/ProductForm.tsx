
"use client";

import React, { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { UploadCloud, Loader2 } from 'lucide-react';
import { storage } from '@/lib/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockProducts } from '@/lib/mock-data'; // Import mockProducts to get categories

const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price: z.preprocess(
    (val) => (typeof val === 'string' ? parseFloat(val) : val),
    z.number().positive("Price must be a positive number.")
  ),
  imageUrl: z.string().url("Must be a valid URL or will be replaced by upload.").or(z.literal('')).optional(),
  category: z.string().min(2, "Category is required."),
  stock: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
    z.number().int().min(0, "Stock cannot be negative.")
  ),
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  onSubmit: (data: ProductFormValues) => void;
  initialData?: Product | null;
  onCancel: () => void;
}

const availableCategories = Array.from(new Set(mockProducts.map(p => p.category))).sort();

export function ProductForm({ onSubmit, initialData, onCancel }: ProductFormProps) {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch, control } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
        name: '',
        description: '',
        price: 0,
        imageUrl: 'https://placehold.co/600x400.png',
        category: '',
        stock: 0
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || 'https://placehold.co/600x400.png');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
        reset({
            ...initialData,
            price: initialData.price,
            stock: initialData.stock,
        });
        setImagePreview(initialData.imageUrl || 'https://placehold.co/600x400.png');
    } else {
        reset({
            name: '',
            description: '',
            price: 0,
            imageUrl: 'https://placehold.co/600x400.png',
            category: '',
            stock: 0
        });
        setImagePreview('https://placehold.co/600x400.png');
    }
    setSelectedFile(null);
  }, [initialData, reset]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please select a valid image file (JPG, PNG, GIF, WebP).",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setValue('imageUrl', ''); 
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const processSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    setIsUploading(true);
    let finalImageUrl = data.imageUrl || 'https://placehold.co/600x400.png';

    if (selectedFile) {
      if (!storage) {
        toast({ title: "Upload Error", description: "Firebase Storage not configured.", variant: "destructive" });
        setIsUploading(false);
        return;
      }
      toast({ title: "Uploading Image...", description: "Please wait." });
      try {
        const imageFileName = `${Date.now()}-${selectedFile.name.replace(/\s+/g, '_')}`;
        const imageRef = storageRef(storage, `product-images/${imageFileName}`);
        await uploadBytes(imageRef, selectedFile);
        finalImageUrl = await getDownloadURL(imageRef);
        toast({ title: "Image Uploaded!", description: "Product image updated." });
      } catch (error: any) {
        console.error("Image upload error:", error);
        toast({
          title: "Image Upload Failed",
          description: error.message || "Could not upload image. Please try again.",
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }
    }

    onSubmit({ ...data, imageUrl: finalImageUrl });
    setIsUploading(false);
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-4 py-4">
      <div>
        <Label htmlFor="name">Product Name</Label>
        <Input id="name" {...register('name')} placeholder="e.g., T-65 X-wing Starfighter Model" />
        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} placeholder="Detailed description of the asset..." />
        {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price (Galactic Credits)</Label>
          <Input id="price" type="number" step="0.01" {...register('price')} placeholder="199.99"/>
          {errors.price && <p className="text-sm text-destructive mt-1">{errors.price.message}</p>}
        </div>
        <div>
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input id="stock" type="number" {...register('stock')} placeholder="10"/>
          {errors.stock && <p className="text-sm text-destructive mt-1">{errors.stock.message}</p>}
        </div>
      </div>
      
      <div>
        <Label>Product Image</Label>
        <div className="mt-2 flex items-center gap-4">
          <div className="w-24 h-24 rounded-md border border-dashed border-muted flex items-center justify-center overflow-hidden">
            {imagePreview ? (
              <Image src={imagePreview} alt="Product Preview" width={96} height={96} className="object-cover" unoptimized={imagePreview.startsWith('blob:')}/>
            ) : (
              <span className="text-xs text-muted-foreground">No Image</span>
            )}
          </div>
          <Button type="button" variant="outline" onClick={triggerFileInput} disabled={isUploading}>
            <UploadCloud className="mr-2 h-4 w-4" /> {selectedFile ? "Change Image" : "Upload Image"}
          </Button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/jpeg,image/png,image/gif,image/webp" 
            disabled={isUploading}
          />
        </div>
        {selectedFile && <p className="text-xs text-muted-foreground mt-1">Selected: {selectedFile.name}</p>}
      </div>
       <div className="hidden">
        <Label htmlFor="imageUrl">Image URL (Fallback)</Label>
        <Input id="imageUrl" {...register('imageUrl')} placeholder="https://... or leave blank if uploading" />
        {errors.imageUrl && <p className="text-sm text-destructive mt-1">{errors.imageUrl.message}</p>}
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.category && <p className="text-sm text-destructive mt-1">{errors.category.message}</p>}
      </div>
      
      <DialogFooter className="pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isUploading}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isUploading}>
          {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (initialData ? 'Save Changes' : 'Add Product')}
        </Button>
      </DialogFooter>
    </form>
  );
}
    

    