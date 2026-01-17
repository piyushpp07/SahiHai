import mongoose from 'mongoose';
import { Transaction } from '../../../../domain/entities/Transaction';
import { TransactionSchema } from '../schemas/TransactionSchema';

const TransactionModel = mongoose.model<Transaction>('Transaction', TransactionSchema);

export class MongooseTransactionRepository {
  async findById(id: string): Promise<Transaction | null> {
    return TransactionModel.findById(id).lean();
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    return TransactionModel.find({ userId }).sort({ createdAt: -1 }).lean();
  }

  async save(transaction: Transaction): Promise<Transaction> {
    const newTransaction = new TransactionModel(transaction);
    const saved = await newTransaction.save();
    return saved.toObject();
  }

  async updateStatus(id: string, status: Transaction['status']): Promise<Transaction> {
    const updated = await TransactionModel.findByIdAndUpdate(id, { status }, { new: true }).lean();
    if (!updated) throw new Error('Transaction not found');
    return updated;
  }
}
