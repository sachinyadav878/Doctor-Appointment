const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    student: String,  // Student ID
    message: String,
});

module.exports = mongoose.model('Notification', notificationSchema);
