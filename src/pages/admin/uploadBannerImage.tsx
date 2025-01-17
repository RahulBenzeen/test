import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Progress } from "../../components/ui/progress";
import { ImageIcon, UploadCloud, X, Trash2, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";

interface Image {
  _id: string;
  url: string;
  public_id: string;
  createdAt: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

const ImageUpload = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteImageId, setDeleteImageId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/products/cloudinary/images`);
      const data = await response.json();
      if (data.success) {
        setImages(data.images);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateFile = (file: File) => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return 'Please upload a valid image file (JPEG, PNG, WebP, GIF, or AVIF)';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB';
    }
    return null;
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const validationError = validateFile(file);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setImage(file);
    setImageUrl(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ACCEPTED_IMAGE_TYPES
    },
    maxFiles: 1,
    multiple: false
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!image) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);

      const formData = new FormData();
      formData.append('image', image);

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 5, 95));
      }, 100);

      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/products/cloudinary/add`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }

      const data = await response.json();
      
      if (data.success) {
        setUploadProgress(100);
        setUploadedImageUrl(data.image.url);
        
        // Refresh images list
        await fetchImages();
        
        // Reset form after successful upload
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
          clearImage();
        }, 1000);
      } else {
        throw new Error(data.message || 'Failed to upload image');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to upload image. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (imageId: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/products/cloudinary/delete/${imageId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      const data = await response.json();
      if (data.success) {
        await fetchImages();
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    } finally {
      setIsDeleting(false);
      setDeleteImageId(null);
    }
  };

  const clearImage = () => {
    setImage(null);
    setImageUrl(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="flex items-center justify-center mb-6">
            <ImageIcon className="w-8 h-8 text-primary mr-2" />
            <h2 className="text-3xl font-bold text-gray-900">Image Management</h2>
          </div>

          {/* Upload Section */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4">Upload New Image</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 transition-colors duration-200 ease-in-out cursor-pointer
                  ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}
                  ${error ? 'border-red-500 bg-red-50' : ''}`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center text-center">
                  <UploadCloud className={`w-12 h-12 mb-4 ${isDragActive ? 'text-primary' : 'text-gray-400'}`} />
                  <p className="text-lg font-medium text-gray-700">
                    {isDragActive ? 'Drop your image here' : 'Drag & drop your image here'}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">or click to browse</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Supports: JPEG, PNG, WebP, GIF, AVIF (max 5MB)
                  </p>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {imageUrl && (
                <div className="relative">
                  <div className="absolute -top-2 -right-2 z-10">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="h-6 w-6 rounded-full"
                      onClick={clearImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {image?.name} ({((image?.size ?? 0) / 1024 / 1024).toFixed(2)}MB)
                  </p>
                </div>
              )}

              {uploadedImageUrl && (
                <Alert className="bg-green-50 border-green-200">
                  <AlertDescription className="text-green-800">
                    Image uploaded successfully!
                  </AlertDescription>
                </Alert>
              )}

              {isUploading && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-gray-500 text-center">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={!image || isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload Image'}
              </Button>
            </form>
          </div>

          {/* Gallery Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Image Gallery</h3>
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No images uploaded yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((img) => (
                  <div key={img._id} className="group relative">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={img.url}
                        alt="Uploaded"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="rounded-full"
                        onClick={() => setDeleteImageId(img._id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 truncate">
                      {new Date(img.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteImageId} onOpenChange={() => setDeleteImageId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the image.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteImageId && handleDelete(deleteImageId)}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ImageUpload;