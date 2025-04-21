"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { Loader2, UserCircle, Mail, Check, Camera, LogOut, X } from "lucide-react"
import { fetchUserData, updateUserProfile, updateUserProfilePicture, logoutUserThunk } from "../../store/authSlice"
import showToast from "../../utils/toast/toastUtils"

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null)
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const { status } = useAppSelector((state) => state.auth)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
      })
    }
  }, [user, form])

  useEffect(() => {
    if (status === "idle" && user?.id) {
      dispatch(fetchUserData(user.id))
    }
  }, [status, dispatch, user])

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const updatedUser = await dispatch(updateUserProfile(data)).unwrap()
      setIsEditing(false)
      form.reset({
        name: updatedUser.name,
        email: updatedUser.email,
      })
      showToast("Profile updated successfully", "success")
    } catch {
      showToast("Failed to update profile", "error")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        showToast("File size exceeds 5MB limit", "error")
        return
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        showToast("Invalid file type. Use JPG, PNG or WebP", "error")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
      setNewProfilePicture(file)
    }
  }

  const updateProfilePicture = async () => {
    if (!newProfilePicture) {
      showToast("No new profile picture selected", "error")
      return
    }

    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64String = reader.result as string
        const profilePictureData = { profilePicture: base64String }
        await dispatch(updateUserProfilePicture(profilePictureData)).unwrap()
        setNewProfilePicture(null)
        setPreviewImage(null)
        showToast("Profile picture updated successfully", "success")
      }
      reader.readAsDataURL(newProfilePicture)
    } catch {
      showToast("Failed to update profile picture", "error")
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-0 shadow-none bg-transparent">
      <CardHeader className="relative px-0 space-y-6">
        <Button
          onClick={() => dispatch(logoutUserThunk())}
          variant="outline"
          className="absolute top-0 right-0 flex items-center gap-2 bg-destructive/10 hover:bg-destructive/20 text-destructive border-0"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
        
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-background shadow-xl cursor-pointer transition-all duration-300 group-hover:scale-105">
                <AvatarImage src={previewImage || user.profilePicture} className="object-cover" />
                <AvatarFallback className="text-3xl bg-primary/5">
                  {user.name
                    ? user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2.5 cursor-pointer shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
              >
                <Camera className="w-5 h-5" />
              </label>
            </div>
            <input id="avatar-upload" type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>
          
          <div className="space-y-3 text-center md:text-left flex-1">
            <div>
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {user.name || "User"}
              </CardTitle>
              <CardDescription className="text-lg mt-2 flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-4 h-4 text-primary" />
                {user.email}
              </CardDescription>
            </div>
            
            {user.role && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            )}
          </div>
        </div>

        {newProfilePicture && (
          <div className="flex gap-3 mt-4 justify-center md:justify-start">
            <Button onClick={updateProfilePicture} className="gap-2">
              <Check className="w-4 h-4" />
              Update Picture
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setNewProfilePicture(null)
                setPreviewImage(null)
              }}
              className="gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6 mt-6">
        <div className="bg-primary/5 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4 text-primary">Personal Information</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                        <Input
                          {...field}
                          disabled={!isEditing}
                          className={`pl-10 h-12 ${!isEditing ? "bg-background" : ""} border-primary/20 focus:border-primary`}
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
                    <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                        <Input
                          {...field}
                          type="email"
                          disabled={!isEditing}
                          className={`pl-10 h-12 ${!isEditing ? "bg-background" : ""} border-primary/20 focus:border-primary`}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isEditing && (
                <div className="flex gap-4 pt-2">
                  <Button type="submit" className="flex-1 h-12">
                    <Check className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false)
                      form.reset()
                    }}
                    className="flex-1 h-12"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </div>
      </CardContent>

      <CardFooter className="px-0">
        {!isEditing && (
          <Button 
            onClick={() => setIsEditing(true)} 
            variant="outline" 
            className="w-full h-12 border-primary/20 hover:bg-primary/5"
          >
            Edit Profile
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}