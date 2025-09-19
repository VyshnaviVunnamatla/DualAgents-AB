import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './src/routes/index.js'; // Import the central route handler

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: false })); // Body parser for URL-encoded data

// Configure CORS
const allowedOrigins = [
  'http://localhost:5173', // For local frontend development
  'https://dual-agents-ab-frontend.vercel.app' // Your deployed Vercel frontend URL (UPDATE THIS)
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Allow cookies/authorization headers
}));

// API Routes
routes(app);

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Something broke!' });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
