const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json()); // Parse incoming JSON requests

// DB connection
mongoose.connect(
  "mongodb+srv://UwihanganyeObed:Sun123@cluster0.gvdipjg.mongodb.net/Weather-Db?retryWrites=true&w=majority&appName=Cluster0"
)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('Connection error', err));

// Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const countRoutes = require('./routes/countRoutes');
const ussdRoutes = require('./routes/ussdRoutes');

app.get('/', (req, res) => {
   res.json("Hello world");
});

app.use('/api/users', userRoutes);    // User routes
app.use('/api/products', productRoutes);  // Product routes
app.use('/api/counts', countRoutes);  // Count routes
app.use('/ussd', ussdRoutes);  // USSD routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
