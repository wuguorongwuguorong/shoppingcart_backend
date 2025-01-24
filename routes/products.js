const express = require('express');
const router = express.Router();
const productService = require('../services/productService');


//create product
router.post('/create', async (req, res) => {
  try {

    // Register user with the new payload structure
    const productId = await productService.createProduct(req.body);

    res.status(201).json({ message: "Products successfully", productId });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a single product
router.get('/:id', async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;