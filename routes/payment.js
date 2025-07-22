const express = require('express');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const Doctor = require('../models/doctor');
const MailData = require('../models/maildata'); // Import the new schema
require('dotenv').config();

const router = express.Router();
router.use(bodyParser.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});




const jwt = require('jsonwebtoken');

// Middleware to verify token and set req.user
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user; // User payload (e.g., { email, id })
    next();
  });
}



// Create Razorpay order
router.post('/create-order', async (req, res) => {
  const { amount } = req.body;
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      payment_capture: 1
    });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
});

// Verify payment and send email


router.post('/verify-payment', async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    doctorId,
    userEmail,
    userName,
    timeSlot
  } = req.body;

  try {
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid Razorpay signature' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    const subject = 'Your Appointment is Confirmed!';
    const html = `
      <h2>Appointment Details</h2>
      <p><b>Patient Name:</b> ${userName}</p>
      <p><b>Doctor:</b> ${doctor.name}</p>
      <p><b>Time Slot:</b> ${timeSlot}</p>
      <p><b>Meeting Link:</b> <a href="${doctor.meeting_link}">${doctor.meeting_link}</a></p>
      <p><b>Chat Code:</b> ${doctor.chat_code}</p>
    `;


    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: userEmail,
      subject,
      html
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Save the email data to the database
    const mailData = new MailData({
      userEmail,
      doctorId,
      timeSlot,
      subject,
      html
    });

    await mailData.save();

    res.status(200).json({ message: 'Payment verified, email sent, and saved to DB successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify payment, send email, or save data' });
  }
});



router.get('/my-appointments',authenticateToken, async (req, res) => {
  try {
    // Assuming user email is stored in the session (or JWT token)
    const userEmail = req.user.email; // Replace with your session or auth logic

    if (!userEmail) {
      return res.status(401).json({ error: 'Unauthorized: Please log in.' });
    }

    // Fetch all mail records for the logged-in user
    const appointments = await MailData.find({ userEmail }).populate('doctorId', 'name specialization');

    if (appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found for this user.' });
    }

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments.' });
  }
});



module.exports = router;
