"use client";

import { create } from "zustand";
import { User, UserRole, WorkshopSession, Reservation, PotteryPiece, InventoryItem, Notification, AIConciergeMessage } from "@/types";
import { generateId } from "@/lib/utils";

interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;

  // Data
  sessions: WorkshopSession[];
  reservations: Reservation[];
  pieces: PotteryPiece[];
  inventory: InventoryItem[];
  notifications: Notification[];
  aiMessages: AIConciergeMessage[];

  // Actions
  addReservation: (reservation: Omit<Reservation, "id" | "createdAt">) => void;
  cancelReservation: (id: string) => void;
  addPiece: (piece: Omit<PotteryPiece, "id" | "createdAt">) => void;
  updatePieceStatus: (id: string, status: PotteryPiece["status"]) => void;
  addNotification: (notification: Omit<Notification, "id" | "createdAt" | "read">) => void;
  markNotificationRead: (id: string) => void;
  addAIMessage: (message: Omit<AIConciergeMessage, "id" | "timestamp">) => void;
  updateInventory: (id: string, quantity: number) => void;
}

const demoSessions: WorkshopSession[] = [
  {
    id: "ws-1",
    title: "Çömlekçi Çarkı Atölyesi - Temel",
    instructor: "Barış Özarıkça",
    date: "2026-05-02",
    time: "10:00",
    duration: 60,
    capacity: 12,
    enrolled: 8,
    waitlist: 0,
    location: "Ana Atölye - Çark 1",
    description: "Çocuklar için eğlenceli çömlekçi çarkı deneyimi. Vazo, kase ve figür yapımı.",
    price: 450,
    status: "available",
    tags: ["çocuk", "başlangıç", "çark"],
  },
  {
    id: "ws-2",
    title: "Kalp Figürlü Çömlek Atölyesi",
    instructor: "Hayri Ünal",
    date: "2026-05-02",
    time: "14:00",
    duration: 90,
    capacity: 10,
    enrolled: 10,
    waitlist: 3,
    location: "Ana Atölye - Çark 2",
    description: "Sevgi dolu kalp figürlü çömlek yapımı. Anneler Günü özel atölye.",
    price: 550,
    status: "waitlist",
    tags: ["çocuk", "figür", "özel"],
  },
  {
    id: "ws-3",
    title: "Kedi Figürlü Seramik",
    instructor: "Barış Özarıkça",
    date: "2026-05-03",
    time: "11:00",
    duration: 75,
    capacity: 15,
    enrolled: 6,
    waitlist: 0,
    location: "Açık Hava Atölye",
    description: "Sevimli kedi figürleri yapımı. Seramik hamurundan hayvan figürleri.",
    price: 400,
    status: "available",
    tags: ["çocuk", "hayvan", "figür"],
  },
  {
    id: "ws-4",
    title: "Yıldız ve Ay Figürlü Atölye",
    instructor: "Hayri Ünal",
    date: "2026-05-03",
    time: "16:00",
    duration: 60,
    capacity: 12,
    enrolled: 12,
    waitlist: 0,
    location: "Ana Atölye - Çark 1",
    description: "Gökyüzü temalı seramik figürler. Yıldız, ay ve gezegen yapımı.",
    price: 420,
    status: "full",
    tags: ["çocuk", "gece", "figür"],
  },
  {
    id: "ws-5",
    title: "Aile Çömlekçi Günü",
    instructor: "Barış Özarıkça & Hayri Ünal",
    date: "2026-05-04",
    time: "10:00",
    duration: 120,
    capacity: 20,
    enrolled: 14,
    waitlist: 0,
    location: "Ana Atölye - Her İki Çark",
    description: "Aileler için özel çift çark deneyimi. Ebeveyn ve çocuk birlikte çalışır.",
    price: 750,
    status: "available",
    tags: ["aile", "çift çark", "özel"],
  },
  {
    id: "ws-6",
    title: "Mini Vazo Atölyesi",
    instructor: "Hayri Ünal",
    date: "2026-05-04",
    time: "15:00",
    duration: 45,
    capacity: 8,
    enrolled: 3,
    waitlist: 0,
    location: "Ana Atölye - Çark 2",
    description: "Hızlı ve eğlenceli mini vazo yapımı. Kısa süreli atölye.",
    price: 350,
    status: "available",
    tags: ["çocuk", "vazo", "hızlı"],
  },
];

const demoInventory: InventoryItem[] = [
  { id: "inv-1", name: "Beyaz Seramik Hamuru", category: "Hamur", quantity: 25, unit: "kg", minStock: 10, price: 120, supplier: "Seramik Dünyası" },
  { id: "inv-2", name: "Kırmızı Kil Hamuru", category: "Hamur", quantity: 18, unit: "kg", minStock: 8, price: 95, supplier: "Kil Market" },
  { id: "inv-3", name: "Ahşap Modelleme Alet Seti", category: "Alet", quantity: 12, unit: "set", minStock: 5, price: 280, supplier: "Hobi Sepeti" },
  { id: "inv-4", name: "Sünger (Paket)", category: "Sarf", quantity: 45, unit: "paket", minStock: 20, price: 35, supplier: "Seramik Dünyası" },
  { id: "inv-5", name: "Su Kabı (Büyük)", category: "Ekipman", quantity: 8, unit: "adet", minStock: 4, price: 150, supplier: "Kil Market" },
  { id: "inv-6", name: "Önlük (Çocuk Boyu)", category: "Kıyafet", quantity: 30, unit: "adet", minStock: 15, price: 85, supplier: "Hobi Sepeti" },
];

const demoPieces: PotteryPiece[] = [
  { id: "p-1", userId: "u-1", userName: "Ahmet Yılmaz", sessionId: "ws-1", pieceName: "Mini Vazo", createdAt: "2026-04-28T10:30:00", status: "drying", notes: "Güzel bir başlangıç" },
  { id: "p-2", userId: "u-2", userName: "Zeynep Kaya", sessionId: "ws-2", pieceName: "Kalp Kase", createdAt: "2026-04-29T14:15:00", status: "ready_for_pickup", notes: "Anneler Günü hediyesi" },
  { id: "p-3", userId: "u-3", userName: "Mehmet Demir", sessionId: "ws-3", pieceName: "Kedi Figürü", createdAt: "2026-04-30T11:00:00", status: "shaped", notes: "Kulakları biraz büyük oldu" },
];

const demoNotifications: Notification[] = [
  { id: "notif-1", userId: "all", title: "Yeni Atölye Eklendi", message: "5 Mayıs için Yıldız Figürlü atölye eklendi.", type: "info", read: false, createdAt: "2026-05-01T09:00:00" },
  { id: "notif-2", userId: "all", title: "Aile Günü Hatırlatması", message: "Yarınki Aile Çömlekçi Günü için hazır mısınız?", type: "warning", read: false, createdAt: "2026-05-01T18:00:00" },
];

export const useStore = create<AppState>((set, get) => ({
  currentUser: null,
  isAuthenticated: false,
  sessions: demoSessions,
  reservations: [],
  pieces: demoPieces,
  inventory: demoInventory,
  notifications: demoNotifications,
  aiMessages: [
    { id: "ai-1", role: "assistant", content: "Merhaba! Ben Seramik AI Konsiyerjiniz. Size atölye rezervasyonu, parça durumu veya malzeme bilgisi konusunda yardımcı olabilirim. Nasıl yardımcı olabilirim?", timestamp: new Date().toISOString() },
  ],

  login: (user) => set({ currentUser: user, isAuthenticated: true }),
  logout: () => set({ currentUser: null, isAuthenticated: false }),

  switchRole: (role) => {
    const current = get().currentUser;
    if (current) {
      set({ currentUser: { ...current, role } });
    }
  },

  addReservation: (reservation) => {
    const newReservation: Reservation = {
      ...reservation,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      reservations: [...state.reservations, newReservation],
      sessions: state.sessions.map((s) =>
        s.id === reservation.sessionId
          ? { ...s, enrolled: s.enrolled + reservation.guests }
          : s
      ),
    }));
  },

  cancelReservation: (id) => {
    const reservation = get().reservations.find((r) => r.id === id);
    if (reservation) {
      set((state) => ({
        reservations: state.reservations.filter((r) => r.id !== id),
        sessions: state.sessions.map((s) =>
          s.id === reservation.sessionId
            ? { ...s, enrolled: Math.max(0, s.enrolled - reservation.guests) }
            : s
        ),
      }));
    }
  },

  addPiece: (piece) => {
    const newPiece: PotteryPiece = {
      ...piece,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ pieces: [...state.pieces, newPiece] }));
  },

  updatePieceStatus: (id, status) => {
    set((state) => ({
      pieces: state.pieces.map((p) => (p.id === id ? { ...p, status } : p)),
    }));
  },

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      read: false,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ notifications: [...state.notifications, newNotification] }));
  },

  markNotificationRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },

  addAIMessage: (message) => {
    const newMessage: AIConciergeMessage = {
      ...message,
      id: generateId(),
      timestamp: new Date().toISOString(),
    };
    set((state) => ({ aiMessages: [...state.aiMessages, newMessage] }));
  },

  updateInventory: (id, quantity) => {
    set((state) => ({
      inventory: state.inventory.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i
      ),
    }));
  },
}));
