const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: String,
  specialization: String,
  about: String,
  experience: String,
  degree: String,
  meeting_link:String,
  chat_code:String,
  email:String,
  status: { type: String, default: 'pending' }, 
});

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
