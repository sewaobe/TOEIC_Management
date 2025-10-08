self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  const title = data.title || "Thông báo mới";
  const options = {
    body: data.body || "",
    icon: data.icon || "/favicon.ico",
    data: { url: data.url || "/" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification?.data?.url || "/";
  event.waitUntil(clients.openWindow(url));
});
