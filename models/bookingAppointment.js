const mongoose = require('mongoose');

const bookingAppointmentSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctor',
        required: true // This will store the ID of the doctor
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Assuming you have a User model and want to reference it
    },
    symptoms: { 
        type: String,
        required: true
    },
    dateTime: {
        type: Date,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    status: { 
        type: String, 
        default: 'pending' // You can track the status of the appointment (e.g., 'pending', 'confirmed', etc.)
    }
});

const BookingAppointment = mongoose.model('BookingAppointment', bookingAppointmentSchema);
module.exports = BookingAppointment;
