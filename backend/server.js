import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// First: Get directory name equivalent - MUST BE AT TOP
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Second: Load environment variables with explicit path
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Third: Log environment variables to verify
console.log('Environment Variables Loaded:');
console.log('MONGO_URI:', process.env.MONGO_URI ? '***REDACTED***' : 'UNDEFINED!');
console.log('PORT:', process.env.PORT || 5000);

// Now import other modules
import express from 'express';
import todoRoutes from './routes/todo.route.js';
import { connectDB } from './config/db.js';
import cors from 'cors';

const PORT = process.env.PORT || 5000;

// Create Express app
const app = express();

// Middleware
app.use(express.json());
// app.use(cors());  // Uncomment if you need CORS

// Routes
app.use('/api/todos', todoRoutes);

app.use(cors());

// Production static files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  connectDB();
  console.log(`Server started at http://localhost:${PORT}`);
});