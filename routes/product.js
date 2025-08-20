const jwt = require('jsonwebtoken');
const User = require('../models/User');
const express = require('express');
const Product = require('../models/Product');
const multer = require('multer');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


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

router.post('/', upload.single('images'), async (req, res) => {
  try {
    const productData = req.body;
    if (req.file) {
      // Store image as base64 string
      productData.images = [req.file.buffer.toString('base64')];
    }
    // Convert price to number
    if (productData.price) productData.price = Number(productData.price);
    // Validate required fields
    if (!productData.title || !productData.price || !productData.college || !productData.seller) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { college, category, status, search, sortBy, sortOrder, minPrice, maxPrice, user } = req.query;
    const filter = {};
    if (college) filter.college = college;
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (user) filter.seller = user;
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    let sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }
    const products = await Product.find(filter)
      .populate('seller', 'name college contact')
      .sort(sort);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name college contact');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const user = await User.findById(req.user.id);
    if (product.seller.toString() !== req.user.id && !user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }
    Object.assign(product, req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const user = await User.findById(req.user.id);
    if (product.seller.toString() !== req.user.id && !user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }
    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
