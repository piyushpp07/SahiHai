import mongoose from "mongoose";

// Cache the database connection in the module scope for serverless reuse
let cachedConnection: typeof mongoose | null = null;

const logger = {
  info: (msg: string, data?: any) =>
    console.log(`[INFO] ${new Date().toISOString()} - ${msg}`, data || ""),
  error: (msg: string, error?: any) =>
    console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`, error || ""),
  warn: (msg: string, data?: any) =>
    console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`, data || ""),
};

export async function connectToDatabase() {
  // If we have a cached connection and it's connected, reuse it
  if (cachedConnection && mongoose.connection.readyState === 1) {
    logger.info("♻️ Using cached MongoDB connection");
    return cachedConnection;
  }

  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    logger.warn("⚠️ MONGO_URI not configured. Database features disabled.");
    return null;
  }

  try {
    // Configure mongoose for serverless environments
    mongoose.set("strictQuery", false);

    logger.info("🔌 Establishing new MongoDB connection...");

    const connection = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 1,
      retryWrites: true,
      retryReads: true,
      // Optimize for serverless
      serverApi: {
        version: "1" as const,
        strict: true,
        deprecationErrors: true,
      },
    });

    logger.info("✅ MongoDB connected successfully");
    cachedConnection = connection;
    return connection;
  } catch (error: any) {
    logger.error("❌ MongoDB connection failed:", error.message);
    logger.warn("⚠️ Database features will be disabled.");
    return null;
  }
}

// Graceful disconnect (mainly for local development)
export async function disconnectFromDatabase() {
  if (cachedConnection) {
    await mongoose.disconnect();
    cachedConnection = null;
    logger.info("👋 MongoDB disconnected");
  }
}

// Helper to check connection status
export function isConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
