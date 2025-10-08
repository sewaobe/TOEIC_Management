import axiosClient from "./axiosClient";

const SUB_API = "/subscriptions";

// 🧠 Đăng ký Service Worker
export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) throw new Error("Service Worker not supported");
  const registration = await navigator.serviceWorker.register("/sw.js");
  return registration;
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

// ✅ Kiểm tra xem user đã có subscription chưa
export async function checkSubscriptionStatus() {
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return false;

  const sub = await registration.pushManager.getSubscription();
  return !!sub;
}

// ✅ Đăng ký subscription mới
export async function subscribePush(userId: string, vapidPublicKey: string) {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") throw new Error("Notification permission denied");

  const registration = await registerServiceWorker();
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
  });

  await axiosClient.post(SUB_API, { userId, subscription });
  return subscription;
}

// ✅ Huỷ subscription
export async function unsubscribePush() {
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return false;

  const sub = await registration.pushManager.getSubscription();
  if (!sub) return false;

  const endpoint = sub.endpoint;
  await sub.unsubscribe();
  await axiosClient.delete(SUB_API, { data: { endpoint } });
  return true;
}

// ✅ Gửi thử thông báo
export async function sendTestNotification(userId: string) {
  await axiosClient.post("/notifications/send", {
    recipientId: userId,
    message: "Đây là thông báo thử nghiệm từ hệ thống Web Push 💫",
    type: "test",
  });
}
