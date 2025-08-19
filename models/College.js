const mongoose = require('mongoose');

const CollegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
});

module.exports = mongoose.model('College', CollegeSchema);
