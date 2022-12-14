import { UploadApiOptions, v2 as cloudinary } from "cloudinary";

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true,
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export async function uploadImage(imagePath: string, imageId?: string) {
  const options: UploadApiOptions = {
    unique_filename: true,
    folder: "IPB/QuizIcons",
    public_id: imageId,
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options);
    return result.secure_url;
  } catch (error) {
    console.error(error);
  }
}

export default cloudinary;
