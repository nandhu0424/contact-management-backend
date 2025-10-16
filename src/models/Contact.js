const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  notes: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// unique per user: createdBy + phone / createdBy + email
contactSchema.index({ createdBy: 1, phone: 1 }, { unique: true });
contactSchema.index({ createdBy: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('Contact', contactSchema);
