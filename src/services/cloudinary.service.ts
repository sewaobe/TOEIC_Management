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

export const uploadDocumentToCloudinary = async (
  file: File
): Promise<{ url: string; type: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const validTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (!validTypes.includes(file.type)) {
    throw new Error("Định dạng tệp không được hỗ trợ!");
  }

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
    { method: "POST", body: formData }
  );

  const data = await res.json();

  if (!data.secure_url) throw new Error("Upload thất bại!");

  console.log("📄 Uploaded document:", data.secure_url);

  let fileType = "DOCUMENT";
  if (file.type === "application/pdf") fileType = "PDF";
  else if (file.type.includes("word")) fileType = "WORD";
  else if (file.type.includes("excel")) fileType = "EXCEL";

  return { url: data.secure_url, type: fileType };
};