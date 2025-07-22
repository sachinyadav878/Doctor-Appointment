const mongoose = require('mongoose');

// Define mail data schema
const mailDataSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    timeSlot: { type: String, required: true },
    subject: { type: String, required: true },
    html: { type: String, required: true },
    sentAt: { type: Date, default: Date.now }
  });  
const MailData = mongoose.model('MailData', mailDataSchema);

module.exports = MailData;
