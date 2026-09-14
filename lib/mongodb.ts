import mongoose from "mongoose";

const rawUri = process.env.MONGODB_URI?.trim();

function isValidMongoUri(uri?: string): boolean {
  if (!uri) return false;
  if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) return false;
  // If it contains template placeholders like <cluster>, <password>, your-cluster, etc.
  if (/<[^>]+>/.test(uri) || uri.includes("<cluster>") || uri.includes("your-cluster") || uri.includes("<password>")) {
    return false;
  }
  return true;
}

const isConfigured = isValidMongoUri(rawUri);
const MONGODB_URI = isConfigured ? rawUri : undefined;

// CRITICAL: fail fast, don't hang when MongoDB is offline
mongoose.set("bufferCommands", false);

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
};

// Reuse the connection across hot-reloads / serverless invocations.
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cached;

export async function connectDB(): Promise<typeof mongoose | null> {
  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    return null;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 2000
      })
      .catch((err) => {
        console.warn("[AI Studio] MongoDB connection failed — using in-memory store fallback:", err?.message || err);
        cached.promise = null;
        return null;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

