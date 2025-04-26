// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'provider'], required: true },
  profile: {
    fullName: String,
    phone: String,
    // Additional fields based on role
    ...(this.role === 'patient' && {
      allergies: [String],
      medicalHistory: String
    }),
    ...(this.role === 'provider' && {
      licenseNumber: String,
      specialization: String
    })
  }
});

module.exports = mongoose.model('User', userSchema);