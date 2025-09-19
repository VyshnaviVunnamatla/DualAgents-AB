import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db.js'; // MongoDB connection
import routes from './src/routes/index.js'; // Central route handler

dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: false })); // Body parser for URL-encoded data

// Configure CORS
const allowedOrigins = [
  "https://dual-agents-ab.vercel.app", // ✅ Add this
  "http://localhost:3000" // For local frontend development
  // ADD YOUR DEPLOYED VERCEL FRONTEND URL HERE AFTER DEPLOYMENT
  // e.g., 'https://dual-agents-ab-frontend-mern.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Allow cookies/authorization headers (though not strictly needed for JWTs)
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
