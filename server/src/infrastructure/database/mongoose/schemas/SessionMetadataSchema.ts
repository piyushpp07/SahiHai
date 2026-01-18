import mongoose from 'mongoose';

const SessionMetadataSchema = new mongoose.Schema({
  threadId: { type: String, required: true, unique: true },
  provider: { type: String, required: true },
  assignedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

// Compound index for TTL
SessionMetadataSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const SessionMetadata = mongoose.models.SessionMetadata || mongoose.model('SessionMetadata', SessionMetadataSchema);
