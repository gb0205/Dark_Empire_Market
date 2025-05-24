
"use client";

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Loader2, Edit3, UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useRef, type ChangeEvent, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/lib/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import Image from 'next/image';

const profileSchema = z.object({
  name: z.string().min(2, "Designation must be at least 2 characters.").optional(),
  email: z.string().email("Invalid Holonet email format."),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { toast } = useToast();
  const { updateCurrentFirebaseUser, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.avatarUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors, isDirty: isFormDirty }, reset } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || '',
      email: user.email,
    },
  });

  useEffect(() => {
    // Update form default values if user prop changes (e.g., after external update)
    reset({
      name: user.name || '',
      email: user.email,
    });
    setPreviewUrl(user.avatarUrl || null);
  }, [user, reset]);

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
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    setIsLoading(true);
    let photoURL = user.avatarUrl; // Start with current avatar

    try {
      if (selectedFile && user) {
        if (!storage) {
          throw new Error("Firebase Storage is not initialized.");
        }
        const fileExtension = selectedFile.name.split('.').pop();
        const imageRef = storageRef(storage, `avatars/${user.id}/profilePicture.${fileExtension}`);
        
        toast({ title: "Uploading Photo...", description: "Please wait while your new avatar is being uploaded." });
        await uploadBytes(imageRef, selectedFile);
        photoURL = await getDownloadURL(imageRef);
        toast({ title: "Photo Uploaded!", description: "Avatar updated successfully." });
      }

      const updateDetails: { displayName?: string | null; photoURL?: string | null } = {};
      let detailsChanged = false;

      if (data.name && data.name !== user.name) {
        updateDetails.displayName = data.name;
        detailsChanged = true;
      }
      if (photoURL && photoURL !== user.avatarUrl) {
        updateDetails.photoURL = photoURL;
        detailsChanged = true;
      }
      
      if (detailsChanged) {
        await updateCurrentFirebaseUser(updateDetails);
        // AuthContext will show its own success toast for profile update
      } else if (!selectedFile && !isFormDirty) {
         toast({
          title: "No Changes",
          description: "No changes were made to your profile.",
        });
      }

      setSelectedFile(null); // Reset selected file after submission attempt

    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        title: "Update Failed",
        description: error.message || "Could not update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl bg-card">
      <CardHeader>
        <CardTitle className="text-2xl font-orbitron">Imperial Officer Profile</CardTitle>
        <CardDescription>Manage your personal data and preferences. Maintain accurate records for the Empire.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
            <div className="relative group">
              <Image 
                src={previewUrl || `https://placehold.co/120x120.png?text=${user.email?.[0]?.toUpperCase() || 'U'}`} 
                alt="User Avatar" 
                width={120}
                height={120}
                className="rounded-full object-cover border-2 border-primary"
                data-ai-hint="user avatar" 
              />
              <Button 
                type="button"
                variant="outline"
                size="icon"
                className="absolute bottom-0 right-0 rounded-full bg-background/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Change profile picture"
              >
                <Edit3 className="h-5 w-5" />
              </Button>
              <Input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/jpeg,image/png,image/gif,image/webp"
              />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xl font-semibold">{user.name || user.email.split('@')[0]}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
               {selectedFile && (
                <div className="mt-2 text-xs text-accent">
                  <UploadCloud className="inline h-4 w-4 mr-1"/>
                  New photo selected: {selectedFile.name.length > 20 ? selectedFile.name.substring(0, 17) + '...' : selectedFile.name}
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Designation (Name)</Label>
            <Input
              id="name"
              type="text"
              {...register('name')}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Holonet Email (Read-only)</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              readOnly
              className="bg-muted/50 cursor-not-allowed"
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

        </CardContent>
        <CardFooter>
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading || authLoading || (!isFormDirty && !selectedFile)}>
            {isLoading || authLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
