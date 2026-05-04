"use client";

import { useStore } from "@/hooks/useStore";
import { formatDate } from "@/lib/utils";
import { Bell, Info, CheckCircle, AlertTriangle, XCircle, Trash2 } from "lucide-react";

export default function Notifications() {
  const { notifications, markNotificationRead, currentUser } = useStore();

  const myNotifications = notifications.filter(
    (n) => n.userId === currentUser?.id || n.userId === "all"
  );

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return CheckCircle;
      case "warning": return AlertTriangle;
      case "error": return XCircle;
      default: return Info;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "success": return "bg-olive-50 border-olive-200 text-olive-700";
      case "warning": return "bg-ocher-50 border-ocher-200 text-ocher-700";
      case "error": return "bg-red-50 border-red-200 text-red-700";
      default: return "bg-blue-50 border-blue-200 text-blue-700";
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-charcoal-800">Bildirimler</h1>
          <p className="text-charcoal-500 mt-1">Sistem ve atölye bildirimleri</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-terracotta-100 text-terracotta-600 flex items-center justify-center">
          <Bell className="w-6 h-6" />
        </div>
      </div>

      {myNotifications.length > 0 ? (
        <div className="space-y-3">
          {myNotifications.map((notification) => {
            const Icon = getIcon(notification.type);
            const colorClass = getColor(notification.type);

            return (
              <div
                key={notification.id}
                onClick={() => markNotificationRead(notification.id)}
                className={`card-luxury p-5 cursor-pointer transition-all ${
                  !notification.read ? "border-l-4 border-l-terracotta-400" : "opacity-70"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-charcoal-800">{notification.title}</h3>
                      <span className="text-xs text-charcoal-400 flex-shrink-0">
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-charcoal-500 mt-1">{notification.message}</p>
                  </div>
                  {!notification.read && (
                    <div className="w-2.5 h-2.5 rounded-full bg-terracotta-500 flex-shrink-0 mt-2" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <Bell className="w-12 h-12 text-charcoal-300 mx-auto mb-4" />
          <h3 className="font-serif text-xl text-charcoal-700 mb-2">Bildirim Yok</h3>
          <p className="text-charcoal-500">Yeni bildirim geldiğinde burada görünecek</p>
        </div>
      )}
    </div>
  );
}
