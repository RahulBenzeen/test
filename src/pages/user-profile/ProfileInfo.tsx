'use client'

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

import { Loader2, UserCircle, Mail, Check, Camera, LogOut } from 'lucide-react';
import showToast from "../../utils/toast/toastUtils";
import { fetchUserData, updateUserProfile, updateUserProfilePicture, logoutUserThunk } from "../../store/authSlice";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { status } = useAppSelector((state) => state.auth);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, form]);

  useEffect(() => {
    if (status === 'idle' && user?.id) {
      dispatch(fetchUserData(user.id));
    }
  }, [status, dispatch, user]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const updatedUser = await dispatch(updateUserProfile(data)).unwrap();
      setIsEditing(false);
      form.reset({
        name: updatedUser.name,
        email: updatedUser.email,
      });
      showToast("Your profile has been successfully updated.", 'success');
    } catch {
      showToast("Failed to update profile. Please try again.", 'error');
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogout = () => {
    dispatch(logoutUserThunk());
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        showToast("File size exceeds 5MB limit.", 'error');
        return;
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        showToast("Only .jpg, .jpeg, .png and .webp formats are supported.", 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setNewProfilePicture(file);
    }
  };

  const updateProfilePicture = async () => {
    if (!newProfilePicture) {
      showToast("No new profile picture selected.", "error");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const profilePictureData = { profilePicture: base64String };

        await dispatch(updateUserProfilePicture(profilePictureData)).unwrap();

        setNewProfilePicture(null);
        setPreviewImage(null);
        showToast("Your profile picture has been successfully updated.", "success");
      };
      reader.onerror = () => {
        showToast("Failed to process the image. Please try again.", "error");
      };

      reader.readAsDataURL(newProfilePicture);
    } catch {
      showToast("Failed to update profile picture. Please try again.", "error");
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="relative">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="absolute top-2 right-2 flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <Avatar
              className="w-24 h-24 border-4 border-primary/10 cursor-pointer"
              onClick={handleAvatarClick}
            >
              <AvatarImage src={previewImage || user.profilePicture} />
              <AvatarFallback className="text-2xl bg-primary/5">
                {user.name
                  ? user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1">
              <Camera className="w-4 h-4 text-white" />
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="space-y-1 text-center md:text-left">
            <CardTitle className="text-3xl">{user.name || "User"}</CardTitle>
            <CardDescription className="text-lg flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4" />
              {user.email}
            </CardDescription>
            {user.role && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            )}
          </div>
        </div>
        {newProfilePicture && (
          <Button onClick={updateProfilePicture} className="mt-4">
            Update Profile Picture
          </Button>
        )}
      </CardHeader>

      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input
                        {...field}
                        disabled={!isEditing}
                        className={`pl-10 ${!isEditing ? "bg-gray-50/50" : ""}`}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input
                        {...field}
                        type="email"
                        disabled={!isEditing}
                        className={`pl-10 ${!isEditing ? "bg-gray-50/50" : ""}`}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isEditing && (
              <div className="flex gap-4 pt-2">
                <Button type="submit" className="flex-1">
                  <Check className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    form.reset();
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-6">
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="w-full"
          >
            Edit Profile
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
