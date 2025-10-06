const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadToCloudinary = async (
  file: File
): Promise<{ url: string; type: "AUDIO" | "IMAGE" | "VIDEO" }> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  // ✅ Phân biệt rõ 3 loại MIME
  const isAudio = file.type.startsWith("audio");
  const isVideo = file.type.startsWith("video");

  // ✅ Cloudinary yêu cầu video/audio upload qua endpoint "video/upload"
  const endpoint = isVideo || isAudio ? "video" : "image";

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${endpoint}/upload`,
    { method: "POST", body: formData }
  );

  const data = await res.json();

  console.log("🌩️ Cloudinary response:", data); // 🔍 debug để xem secure_url

  return {
    url: data.secure_url,
    type: isVideo ? "VIDEO" : isAudio ? "AUDIO" : "IMAGE",
  };
};
