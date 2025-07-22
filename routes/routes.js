const express = require('express');
const multer = require('multer');
const path = require('path');
const BookingAppointment = require('../models/bookingAppointment');
const Doctor = require('../models/doctor');
const mongoose = require('mongoose');



const router = express.Router();




// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Render form for doctor details
router.get('/Avdoctor/new', (req, res) => {
    res.render('doc-form');
});





// Submit doctor form
router.post('/submit', upload.single('degree'), async (req, res) => {
    const { name, specialization, about, experience,meeting_link,chat_code,email } = req.body;

    try {
        const newDoctor = new Doctor({
            name,
            specialization,
            about,
            experience,
            meeting_link,
            chat_code,
            email,
            degree: req.file?.filename || '',

        });

        await newDoctor.save();
        res.redirect('/');
    } catch (err) {
        console.error('Error saving doctor details:', err);
        res.status(500).send('Error saving doctor details');
    }
});



// Accept/Reject doctor
router.post('/admin/:id/:action', async (req, res) => {
    const { id, action } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Invalid Doctor ID');
    }

    try {
        if (action === 'accept') {
            await Doctor.findByIdAndUpdate(id, { status: 'accepted' });
        } else if (action === 'reject') {
            await Doctor.findByIdAndDelete(id);
        } else {
            return res.status(400).send('Invalid Action');
        }

        res.redirect('/admin');
    } catch (err) {
        console.error('Error processing admin action:', err);
        res.status(500).send('Error updating request status');
    }
});

// Fetch available doctors




// Remove doctor
router.post('/admin/remove/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Schema.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Invalid Doctor ID');
    }

    try {
        const result = await Doctor.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).send('Doctor not found');
        }

        res.redirect('/admin');
    } catch (err) {
        console.error('Error removing doctor:', err);
        res.status(500).send('Error removing doctor');
    }
});


// Route to book an appointment
// Route to handle booking an appointment






module.exports = router;
