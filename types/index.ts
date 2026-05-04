export type UserRole = 'guest' | 'instructor' | 'manager' | 'finance' | 'superadmin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roomNumber?: string;
  checkIn?: string;
  checkOut?: string;
  avatar?: string;
  isActive: boolean;
}

export interface WorkshopSession {
  id: string;
  title: string;
  instructor: string;
  date: string;
  time: string;
  duration: number;
  capacity: number;
  enrolled: number;
  waitlist: number;
  location: string;
  description: string;
  price: number;
  image?: string;
  status: 'available' | 'full' | 'waitlist' | 'closed';
  tags: string[];
}

export interface Reservation {
  id: string;
  userId: string;
  sessionId: string;
  status: 'confirmed' | 'cancelled' | 'waitlist' | 'completed';
  createdAt: string;
  guests: number;
  notes?: string;
  totalPrice: number;
}

export interface PotteryPiece {
  id: string;
  userId: string;
  userName: string;
  sessionId: string;
  pieceName: string;
  description?: string;
  photoUrl?: string;
  createdAt: string;
  status: 'shaped' | 'drying' | 'ready_for_pickup' | 'picked_up' | 'shipped';
  notes?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  price: number;
  supplier?: string;
  lastRestocked?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface AIConciergeMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
