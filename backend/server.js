// server.js
const express = require('express');
const connectDB = require('./config/db');
const config = require('./config/config');
const errorMiddleware = require('./middlewares/errorMiddleware');
const cors = require('cors');
// Create an Express application
const app = express();

// Connect to the MongoDB database
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors({
  origin: "https://athena-i9sg.vercel.app", // only allow frontend origin
  credentials: true, // allow cookies/session to be sent
}));

// Mount API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/librarian', require('./routes/librarianRoutes'));
app.use('/api/member', require('./routes/memberRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/borrow', require('./routes/borrowRoutes'));

// Global error handling middleware
app.use(errorMiddleware);

// Start the server
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
