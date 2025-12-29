
export interface Bill {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  category: 'Groceries' | 'Electronics' | 'Clothing' | 'Dining' | 'Other';
  color: string;
  icon: string;
  items: Array<{ name: string; price: number }>;
  imageUrl?: string;
  returnUrl: string;
  exchangeUrl: string;
  status: 'active' | 'returned' | 'exchanged';
  returnWindowDays: number;
  warrantyMonths?: number;
  isOnlineOrder?: boolean;
  orderStatus?: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  trackingId?: string;
}

export interface User {
  id: string;
  birdyId: string;
  name: string;
  email: string;
  phone: string;
  treesSaved: number;
  points: number;
  syncEmail: string;
}

export type TabType = 'wallet' | 'id' | 'analytics' | 'profile';

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  treesSaved: number;
  birdyId: string;
}
