import showToast from "../toast/toastUtils";

export const uploadToCloudinary = async (
  file: File
): Promise<{ secure_url: string; public_id: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    // Return both secure_url and public_id
    return { secure_url: data.secure_url, public_id: data.public_id };
  } catch (error) {
    showToast('Error uploading to Cloudinary:', 'error');
    throw error;
  }
};
