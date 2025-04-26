const mongoose = require('mongoose');

const vaccineSchema = new mongoose.Schema({
  patientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  providerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  name: { 
    type: String, 
    required: true 
  },
  dateAdministered: Date,
  dateScheduled: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['scheduled', 'completed', 'overdue', 'pending-verification'],
    default: 'scheduled'
  },
  doseNumber: Number,
  manufacturer: String,
  lotNumber: String,
  notes: String,
  verifiedByProvider: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

vaccineSchema.pre('save', function(next) {
  if (this.dateAdministered) {
    this.status = 'completed';
  } else if (new Date() > this.dateScheduled) {
    this.status = 'overdue';
  }
  next();
});

module.exports = mongoose.model('Vaccine', vaccineSchema);