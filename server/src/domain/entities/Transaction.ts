export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  currency: 'INR';
  status: 'pending' | 'completed' | 'failed';
  type: 'payment' | 'reward';
  description: string;
  metadata: Record<string, any>;
  createdAt: Date;
}
