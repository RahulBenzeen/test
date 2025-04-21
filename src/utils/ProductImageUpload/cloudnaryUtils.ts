import showToast from "../toast/toastUtils";
import { uploadToCloudinary } from "./cloudanary";

// Helper function to delete an image from Cloudinary
export const deleteFromCloudinary = async (publicId: string) => {
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME}/image/destroy`,
      {
        method: 'POST',
        body: JSON.stringify({
          public_id: publicId,
          api_key: import.meta.env.VITE_APP_CLOUDINARY_API_KEY, // Include your Cloudinary API Key here
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete image');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    showToast('Error deleting from Cloudinary:', 'error');
    throw error;
  }
};

// Function to upload a new image to Cloudinary and update
export const uploadAndUpdateImage = async (
  file: File,
  oldImagePublicId?: string
): Promise<{ secure_url: string; public_id: string }> => {
    // Delete the old image if it exists
    if (oldImagePublicId) {
      await deleteFromCloudinary(oldImagePublicId);
    }
    // Upload the new image
    const data = await uploadToCloudinary(file);
    // Return the new image URL and public ID
    return data;
};
