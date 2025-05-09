import axios from 'axios';

export const port = 8080

export const link = `http://localhost:${port}`
// export const link = `http://161.35.35.250:${port}`
// console.log(import.meta.env)
const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME

export const uploadToCloudinary = async (file: File) => {

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'mbungai');
  console.log(formData);

  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, // Replace 'df5uqnkgi' with your cloud name
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    // this.newArtist.artistImage = response.data.secure_url; // Save the uploaded image URL
    console.log('Image uploaded successfully:', res.data.secure_url);
    return res.data.secure_url as string
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error("Error uploading image:")
  }
};
