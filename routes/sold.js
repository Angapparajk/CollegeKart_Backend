const express = require('express');
const Sold = require('../models/Sold');
const Product = require('../models/Product');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Move product to Sold DB
router.post('/sell/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to mark as sold' });
    }
    // Create sold entry
    const sold = new Sold({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      college: product.college,
      images: product.images,
      seller: product.seller,
      soldAt: new Date()
    });
    await sold.save();
    await product.deleteOne();
    res.json({ message: 'Product marked as sold', sold });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get sold products for a user
router.get('/user/:id', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const soldProducts = await Sold.find({ seller: req.params.id });
    res.json(soldProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
