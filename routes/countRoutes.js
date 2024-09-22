const express = require('express');
const User = require('../models/User'); // Adjust the path as necessary
const Product = require('../models/Products'); // Adjust the path as necessary
const router = express.Router();

// Endpoint to get counts
router.get('/', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    // You can add more counts here (e.g., markets, items) based on your models

    res.json({
      users: userCount,
      products: productCount,
      // Add other counts as needed
    });
  } catch (error) {
    console.error("Error fetching counts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
