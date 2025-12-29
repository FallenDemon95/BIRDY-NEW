
import { Bill, LeaderboardEntry, Notification } from './types';

export const MOCK_BILLS: Bill[] = [
  {
    id: 'B-AMZN-402',
    merchant: 'Amazon India',
    amount: 12499.00,
    date: new Date().toISOString().split('T')[0],
    category: 'Electronics',
    color: 'bg-zinc-900',
    icon: 'A',
    items: [{ name: 'Kindle Paperwhite (16 GB)', price: 12499.00 }],
    returnUrl: 'https://www.amazon.in/returns',
    exchangeUrl: 'https://www.amazon.in/returns',
    status: 'active',
    returnWindowDays: 10,
    isOnlineOrder: true,
    orderStatus: 'Shipped',
    trackingId: 'AZN-9981240'
  },
  {
    id: 'B-RELIANCE-99',
    merchant: 'Reliance Digital',
    amount: 54900.00,
    date: '2024-05-24',
    category: 'Electronics',
    color: 'bg-red-800',
    icon: 'RD',
    items: [{ name: 'OnePlus 12 5G', price: 54900.00 }],
    returnUrl: 'https://www.reliancedigital.in/returns',
    exchangeUrl: 'https://www.reliancedigital.in/returns',
    status: 'active',
    returnWindowDays: 7,
    warrantyMonths: 12
  },
  {
    id: 'B-ZARA-ACTIVE',
    merchant: 'Zara India',
    amount: 12990.00,
    date: '2024-05-15',
    category: 'Clothing',
    color: 'bg-stone-800',
    icon: 'Z',
    items: [
      { name: 'Leather Biker Jacket', price: 9990.00 },
      { name: 'Slim Fit Denim', price: 3000.00 }
    ],
    returnUrl: 'https://www.zara.com/in/en/help-center/returns',
    exchangeUrl: 'https://www.zara.com/in/en/help-center/exchanges',
    status: 'active',
    returnWindowDays: 30,
  },
  {
    id: 'B-SONY-X5',
    merchant: 'Sony Center',
    amount: 29990.00,
    date: '2024-05-20',
    category: 'Electronics',
    color: 'bg-zinc-800',
    icon: 'S',
    items: [{ name: 'Sony WH-1000XM5 Headphones', price: 29990.00 }],
    returnUrl: 'https://www.sony.co.in/microsite/warranty-repair/return-policy',
    exchangeUrl: 'https://www.sony.co.in/microsite/warranty-repair/',
    status: 'active',
    returnWindowDays: 7,
    warrantyMonths: 12
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Order Update',
    message: 'Your Amazon order for Kindle Paperwhite has been Shipped!',
    time: 'Just now',
    isRead: false
  },
  {
    id: '2',
    title: 'New Bill Arrived!',
    message: 'We found a new receipt in your Birdy Sync Inbox from Swiggy.',
    time: '2 hours ago',
    isRead: false
  },
  {
    id: '3',
    title: 'Sustainability Pro',
    message: 'You have saved your 28th tree today. Your leaderboard rank jumped!',
    time: '1 day ago',
    isRead: true
  }
];

export const LEADERBOARD_DATA: LeaderboardEntry[] = [
  { rank: 1, name: 'Arjun Kapoor', treesSaved: 54, birdyId: 'ARJN.9921' },
  { rank: 2, name: 'Priya Sharma', treesSaved: 48, birdyId: 'PRYA.1042' },
  { rank: 3, name: 'Rohan Mehta', treesSaved: 42, birdyId: 'RHAN.7731' },
  { rank: 4, name: 'Ananya Iyer', treesSaved: 31, birdyId: 'ANNY.4402' },
  { rank: 5, name: 'You', treesSaved: 28, birdyId: 'BIRDY.9988' }
];
