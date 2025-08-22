const mongoose = require('mongoose');

const SoldSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  college: String,
  images: [String],
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  soldAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sold', SoldSchema);
