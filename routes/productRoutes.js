// products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Products');

// Add a new product
router.post('/', async (req, res) => {
    const { name, price, category, market } = req.body;
    try {
        const newProduct = new Product({ name, price, category, market });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: 'Error adding product', error });
    }
});

// List all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching products', error });
    }
});

// Update a product by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price, category, market } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, price, category, market },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: 'Error updating product', error });
    }
});

// Delete a product by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting product', error });
    }
});

module.exports = router;