export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === "granted";
}

export function scheduleNotifications() {
  if (!("serviceWorker" in navigator)) {
    console.log("Service workers are not supported");
    return;
  }

  const times = [
    { hour: 9, minute: 0, message: "Time to log your breakfast!" },
    { hour: 13, minute: 0, message: "Don't forget to log your lunch!" },
    { hour: 18, minute: 0, message: "Remember to log your dinner!" },
  ];

  // Schedule notifications for today
  times.forEach(scheduleNotificationForTime);
}

function scheduleNotificationForTime({
  hour,
  minute,
  message,
}: {
  hour: number;
  minute: number;
  message: string;
}) {
  const now = new Date();
  const scheduledTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hour,
    minute
  );

  // If the time has passed today, schedule for tomorrow
  if (scheduledTime.getTime() < now.getTime()) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const timeUntilNotification = scheduledTime.getTime() - now.getTime();

  setTimeout(() => {
    showNotification(message);
    // Reschedule for next day
    scheduleNotificationForTime({ hour, minute, message });
  }, timeUntilNotification);
}

async function showNotification(message: string) {
  if (Notification.permission !== "granted") return;

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification("Meal Helper", {
      body: message,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-192x192.png",
      tag: "meal-reminder",
    });
  } catch (error) {
    console.error("Error showing notification:", error);
  }
}
