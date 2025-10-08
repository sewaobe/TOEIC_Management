import { useEffect, useState } from "react";
import {
  subscribePush,
  unsubscribePush,
  checkSubscriptionStatus,
  sendTestNotification,
} from "../services/push.service";

export function useNotificationWPViewModel(userId: string, vapidKey: string) {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Load trạng thái thực tế khi khởi tạo
  useEffect(() => {
    async function loadStatus() {
      try {
        const hasSub = await checkSubscriptionStatus();
        setSubscribed(hasSub);
      } catch (err: any) {
        console.error("checkSubscriptionStatus error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStatus();
  }, []);

  async function enableNotifications() {
    try {
      setError(null);
      await subscribePush(userId, vapidKey);
      setSubscribed(true);
    } catch (err: any) {
      setError(err.message || "Không thể đăng ký thông báo");
    }
  }

  async function disableNotifications() {
    try {
      await unsubscribePush();
      setSubscribed(false);
    } catch (err: any) {
      setError(err.message || "Không thể huỷ đăng ký thông báo");
    }
  }

  async function sendTest() {
    try {
      await sendTestNotification(userId);
    } catch (err: any) {
      setError(err.message || "Không thể gửi thông báo thử");
    }
  }

  return {
    subscribed,
    loading,
    error,
    enableNotifications,
    disableNotifications,
    sendTest,
  };
}
