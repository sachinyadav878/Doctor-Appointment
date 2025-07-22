const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');
const Notification = require('../models/Notification');

router.post('/create', async (req, res) => {
    console.log(req.body);
    try {
        const { title, date, link, students = [] } = req.body;

 
        const meeting = new Meeting({ title, date, link, students });
        await meeting.save();
        
     
        const notifications = students.map(studentId => ({
            student: studentId,
            message: `New meeting scheduled: ${title} on ${new Date(date).toLocaleString()}`
        }));
        await Notification.insertMany(notifications);

        res.status(201).json({ message: 'Meeting created and notifications sent' });
    } catch (err) {
        console.error('Error creating meeting:', err);
        res.status(500).json({ message: 'Meeting creation failed', error: err.message });
    }
});

router.get('/upcoming', async (req, res) => {
    try {
        const studentId = req.query.studentId;
        const now = new Date();
        const meetings = await Meeting.find({
            students: studentId,
            date: { $gte: now },
        }).sort({ date: 1 });

        res.json(meetings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/upcoming-teacher', async (req, res) => {
    try {
        const now = new Date();
        const meetings = await Meeting.find({
            date: { $gte: now },
        }).sort({ date: 1 });

        res.json(meetings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const meetingId = req.params.id;
        await Meeting.findByIdAndDelete(meetingId);
        res.status(200).json({ message: 'Meeting deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
