
import { MOCK_BILLS } from '../constants';
import { Bill } from '../types';

class BackendService {
  private bills: Bill[] = [...MOCK_BILLS];

  async getBills(): Promise<Bill[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.bills];
  }

  async addBill(bill: Bill): Promise<void> {
    this.bills.unshift(bill);
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  async processAction(billId: string, action: 'return' | 'exchange'): Promise<string> {
    const bill = this.bills.find(b => b.id === billId);
    if (!bill) throw new Error("Bill not found");
    
    // In a real app, this would hit a merchant API
    const url = action === 'return' ? bill.returnUrl : bill.exchangeUrl;
    
    // Update local state to simulate backend change
    if (action === 'return') bill.status = 'returned';
    else bill.status = 'exchanged';
    
    return url;
  }
}

export const backend = new BackendService();
