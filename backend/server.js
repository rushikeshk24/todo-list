// Load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

console.log("MONGO_URI =", process.env.MONGO_URI);

import express from 'express';
import todoRoutes from './routes/todo.route.js';
import { connectDB } from './config/db.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

// Debug Logs
console.log('Environment Variables Loaded:');
console.log('MONGO_URI:', process.env.MONGO_URI ? '***REDACTED***' : 'UNDEFINED!');
console.log('PORT:', PORT);

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/todos', todoRoutes);

// Production Static Files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'));
  });
}

// Start Server
app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server started at http://localhost:${PORT}`);
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
});
