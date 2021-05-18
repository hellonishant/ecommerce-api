const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  street: {
    type: String,
    default: '',
  },
  apartment: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    default: '',
  },
  zip: {
    type: String,
    default: null,
  },
  country: {
    type: String,
    default: '',
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.virtual('id').get(() => this._id.toHexString());
userSchema.set('toJSON', { virtuals: true });

exports.User = mongoose.model('User', userSchema);
