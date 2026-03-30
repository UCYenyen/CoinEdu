"use client";

import React, { useState, useRef } from "react";
import { UserProfile, UpdateProfileInput } from "../interfaces/profile";
import { updateProfileAction } from "../actions/profile-actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Camera, Loader2, Save, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileFormProps {
  user: UserProfile;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileInput>({
    name: user.name,
    image: user.image,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional: limit to 2MB to reduce DB overhead
    const MAX_SIZE_MB = 2;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Image must be less than ${MAX_SIZE_MB}MB`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setFormData((prev) => ({ ...prev, image: base64String }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateProfileAction(user.id, formData);

      if (result.success) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(result.error || "An error occurred");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="glass-card border-none shadow-2xl luminous-glow overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Profile Settings
          </CardTitle>
          <CardDescription className="text-muted-foreground/80">
            Manage your public profile and account details
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-8">
            {/* Avatar Section */}
            <div className="flex items-center gap-6 p-4 rounded-2xl bg-surface-container/30 border border-white/5 physics-transition hover:bg-surface-container/50">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-2 border-primary/20 physics-transition group-hover:border-primary/50 shadow-lg">
                  <AvatarImage src={formData.image || ""} alt={user.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div 
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 physics-transition cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="text-white h-6 w-6" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-medium text-lg">Profile Picture</h3>
                <p className="text-sm text-muted-foreground">
                  Click to upload a new avatar
                </p>
                <div className="flex gap-2 mt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="h-8 physics-transition hover:scale-105 active:scale-95"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change
                  </Button>
                  {formData.image && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Hidden file input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/png, image/jpeg, image/webp" 
              onChange={handleFileChange}
            />

            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
                  <User size={14} className="text-primary" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-surface-container/20 border-white/10 h-11 focus:ring-primary/20 physics-transition"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold opacity-70">
                  Email Address
                </Label>
                <Input
                  id="email"
                  value={user.email}
                  readOnly
                  disabled
                  className="bg-surface-container/10 border-white/5 h-11 opacity-60 cursor-not-allowed"
                />
                <p className="text-[10px] text-muted-foreground/60 italic ml-1">
                  Email cannot be changed for security reasons
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-2 pb-8 flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="px-8 h-11 bg-primary hover:bg-primary-dim text-white font-bold shadow-[0_0_20px_rgba(163,166,255,0.3)] physics-transition hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
