const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    default: 'Unknown',
  },
  color: {
    type: String,
  },
  icon: {
    type: String,
  },
});

exports.Category = mongoose.model('Category', categorySchema);
