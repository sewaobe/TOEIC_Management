const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadToCloudinary = async (
  file: File
): Promise<{ url: string; type: "AUDIO" | "IMAGE" }> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  // Nếu là audio thì phải đổi endpoint sang /video/upload
  const isAudio = file.type.startsWith("audio");
  const endpoint = isAudio ? "video" : "image";

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${endpoint}/upload`,
    { method: "POST", body: formData }
  );

  const data = await res.json();
  return {
    url: data.secure_url,
    type: isAudio ? "AUDIO" : "IMAGE",
  };
};
