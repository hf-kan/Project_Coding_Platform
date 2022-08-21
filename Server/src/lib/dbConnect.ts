import mongoose from 'mongoose';

import dotenv from 'dotenv';

dotenv.config();

const dbUser = process.env.MONGO_USER;
const dbPass = process.env.MONGO_PASSWORD;
const dbHost = process.env.MONGO_HOST;
// const dbPort = process.env.MONGO_PORT;
const dbName = process.env.MONGO_DB;
const dbOption = process.env.MONGO_OPTION;
// const dbConnectString = `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`;
const dbConnectString = `mongodb+srv://${dbUser}:${dbPass}@${dbHost}/${dbName}${dbOption}`;

function connectDB() {
  try {
    mongoose.connect(dbConnectString, { connectTimeoutMS: 5000 });
  } catch (error) {
    console.error.bind(console.log, 'MongoDB connection error');
  }
  const db = mongoose.connection;
  db.on('error', console.error.bind(console.log, 'MongoDB connection error'));
  db.once('open', () => { console.log('MongoDB connected successfully'); });
}

function disconnectDB(db:any) {
  db.disconnect();
}

export { connectDB, disconnectDB };
