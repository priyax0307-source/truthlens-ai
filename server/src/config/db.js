import mongoose from 'mongoose';

/**
 * Connect to MongoDB database using process.env.MONGO_URI.
 * Designed for MongoDB Atlas cloud clusters without hardcoding local IPs or secrets.
 */
export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI ? process.env.MONGO_URI.trim() : '';

  if (!mongoUri) {
    console.warn('[MongoDB Notice] MONGO_URI is not configured in server/.env.');
    console.warn('[MongoDB Action] To connect to MongoDB Atlas, add your connection string to server/.env:');
    console.warn('                 MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/truthlens?retryWrites=true&w=majority');
    console.warn('[MongoDB Mode] Server is running in resilient in-memory mode until MONGO_URI is configured.');
    return null;
  }

  // Sanitize URI to safely mask password in console logs
  const maskedUri = mongoUri.replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)([^@]+)(@.+)/, '$1****$3');

  try {
    console.log(`[MongoDB] Connecting to cluster: ${maskedUri}...`);
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000,
      autoIndex: true,
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Warning] Connection could not be established: ${error.message}`);
    
    if (mongoUri.includes('mongodb+srv') || mongoUri.includes('.mongodb.net')) {
      console.warn('[MongoDB Atlas Checklist]:');
      console.warn('  1. Network Access: Ensure your current IP address (or 0.0.0.0/0 for any IP) is whitelisted under Network Access in MongoDB Atlas.');
      console.warn('  2. Database User: Ensure the database username and password in MONGO_URI are correct under Database Access in Atlas.');
      console.warn('  3. Special Characters: If your password contains special characters like @, #, or %, ensure they are URL-encoded.');
    } else if (mongoUri.includes('127.0.0.1') || mongoUri.includes('localhost')) {
      console.warn('[MongoDB Tip] You are currently using a local MongoDB URI. Replace MONGO_URI in server/.env with your cloud MongoDB Atlas connection string.');
    }

    console.warn('[MongoDB Notice] Server will continue running in memory / offline resilience mode.');
    return null;
  }
};
