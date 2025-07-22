

const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    link: { type: String, required: true },
    students: [{ type: String }],
});

module.exports = mongoose.model('Meeting', meetingSchema);
