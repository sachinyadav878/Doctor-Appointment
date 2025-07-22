const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const multer = require('multer');
const bcrypt = require('bcrypt');
const path = require('path');
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require('dotenv');
const meetingRoutes = require('./routes/meetingRoutes');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Doctor = require('./models/doctor');
const paymentRoutes = require('./routes/payment');
const routes = require('./routes/routes');
const BookingAppointment = require('./models/bookingAppointment');
const MailData = require('./models/maildata');
const Feedback = require('./models/feedback');
const nodemailer = require('nodemailer');




require('dotenv').config();

const app = express();
app.use('/',paymentRoutes)
app.use('/', routes);


const port = 3000;
const genAI = new GoogleGenerativeAI("AIzaSyBX8KEjHlGA0DoOYuzv7mHCEI_dEJTBErM");


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(cors());
app.set('views',path.join(__dirname,'views'));




app.use(session({
    secret: '7894562584561230',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Make sure secure is false in development or if not using HTTPS
}));



function checkAuthenticated(req, res, next) {
    if (req.session && req.session.user_id) {
       
        return next();
    } else {
        return res.redirect('/login');
    }
}



mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });
  
  

const userSchema = new mongoose.Schema({
    specialist:String,
    experience:Number,
    name: String,
    gender:String,
    description:String,
    email: String,
    password: String,
    image: String,
    meeting_link:String,
    chat_code:String,
    education: [String],
    admin: { type: Boolean, default: false }
});


const User = mongoose.model('User', userSchema);


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 2000000 }, 
});



const isAdmin = async (req, res, next) => {
    try {
        const userId = req.session.user_id;
        if (!userId) {
            return res.status(401).send('Unauthorized: No user ID provided');
        }

        const user = await User.findById(userId);

        if (!user || !user.admin) {
            return res.status(403).send('Forbidden: You do not have access to this page');
        }

        next(); 
    } catch (err) {
        console.error('Error in admin authorization middleware:', err);
        res.status(500).send('Internal Server Error');
    }
};
app.get('/admin', checkAuthenticated, isAdmin, async (req, res) => {
    try {
      const requests = await Doctor.find({ status: 'pending' });
      const doctors = await Doctor.find({ status: 'accepted' });
      const userCount = await User.countDocuments(); 
      const doctorCount = await Doctor.countDocuments({ status: 'accepted' }); 
      const mailDataCount = await MailData.countDocuments();
      const totalRevenue = mailDataCount * 499; 
      const feedbacks = await Feedback.find();
      const totalFeed = await Feedback.countDocuments();
  
      // Pass all data to the EJS template
      res.render('admin', { 
        requests, 
        doctors, 
        userCount, 
        doctorCount, 
        totalRevenue, 
        feedbacks, 
        totalFeed
      });
    } catch (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Internal Server Error');
    }
  });
  
  



// Routes
app.get('/doctor', checkAuthenticated, async (req, res) => {
    try {
        const doctors = await Doctor.find({ status: 'accepted' });
        res.render('availableDoctors', { doctors });
    } catch (err) {
        console.error('Error fetching available doctors:', err);
        res.status(500).send('Error fetching available doctors');
    }
});


app.get('/profile', checkAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.user_id).exec();
        
        res.render('profile', { user });

    } catch (err) {
        res.send('Error');
    }
});



app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/update', checkAuthenticated, (req, res) => {
    res.render('update_profile');
});


app.get('/dashboard', checkAuthenticated, (req, res) => {
    res.render('dashboard');
});


app.post('/dashboard', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).exec();
        if (!user) return res.render('login', { message: 'Incorrect email or password!' });
        const result = await bcrypt.compare(password, user.password);
        if (result) {
            req.session.user_id = { _id: user._id, email: user.email };  // Store both userId and email
            res.render('dashboard');
        } else {
            res.render('login', { message: 'Incorrect email or password!' });
        }
    } catch (err) {
        res.render('login', { message: 'Error during login!' });
    }
});


app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', upload.single('image'), async (req, res) => {
    const { name, email, password, cpassword, description ,gender} = req.body;
    const image = req.file ? req.file.filename : 'default-avatar.png';

    if (password !== cpassword) {
        return res.render('register', { message: 'Passwords do not match!' });
    }

    try {
        const existingUser = await User.findOne({ email }).exec();
        if (existingUser) {
            return res.render('register', { message: 'User already exists!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, image, description,gender });

        await user.save();

        req.session.user_id = user._id;
        res.redirect('/profile');
    } catch (err) {
        console.error('Error during registration:', err);
        res.render('register', { message: 'Registration failed!' });
    }
});


app.get('/update_profile', checkAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.user_id).exec();
        res.render('update_profile', { user });
    } catch (err) {
        res.send('Error');
    }
});

app.post('/update_profile', upload.single('update_image'), checkAuthenticated, async (req, res) => {
    const { update_name, update_email, update_pass, new_pass, confirm_pass, update_description,update_experience,update_specialist } = req.body;
    const update_image = req.file ? req.file.filename : null;
    const update_education = req.body.update_education;

    try {
        const user = await User.findById(req.session.user_id).exec();
        if (update_name) user.name = update_name;
        if (update_email) user.email = update_email;
        
        if(update_experience) user.experience = update_experience;
        if (update_description) user.description = update_description; 
        if (update_specialist) user.specialist = update_specialist;
        if(update_education) user.education = update_education;
        if (update_pass && new_pass && confirm_pass) {
            const match = await bcrypt.compare(update_pass, user.password);
            if (!match) return res.render('update_profile', { message: 'Old password not matched!', user });
            if (new_pass !== confirm_pass) return res.render('update_profile', { message: 'Passwords do not match!', user });
            user.password = await bcrypt.hash(new_pass, 10);
        }
        if (update_image) user.image = update_image;

        await user.save();
        res.redirect('/profile');
    } catch (err) {
        console.error('Error during profile update:', err);
        res.send('Error');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

//ai bot 


app.post("/getResponse", async (req, res) => {
    const { name, symptoms, duration, medicine, language } = req.body;

    const languageName = {
        "en-US": "English",
        "hi-IN": "Hindi",
        "es-ES": "Spanish"
    }[language] || "English"; 

    const prompt = `Please respond in ${languageName}. 
    You are a knowledgeable doctor named Dr. Robo. A patient named ${name} described their condition:
    Symptoms: ${symptoms}, Duration: ${duration} days, Previous Medication: ${medicine}. 
    Provide a basic diagnosis and recommend few medicine not to take but ingeneral what people take. Format the response as a conversation with client in ${languageName}.`;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = await response.text();

        res.json({ response: text });
    } catch (error) {
        console.error('Error occurred while calling Generative AI:', error);
        res.status(500).json({ error: 'Something went wrong!' });
    }
});

// end 




app.get('/appointments', checkAuthenticated, async (req, res) => {
    const userId = req.session.user_id; // Assuming user is logged in and their ID is available in req.user
    const user = await User.findById(req.session.user_id).exec();
    const mailDataList = await MailData.find().populate('doctorId').exec();
    try {
        const appointments = await BookingAppointment.find({ userId }).populate('userId', 'name email'); // Populate user data if needed
        res.render('Appointment/index2', { appointments , user ,mailDataList});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});


// NEW ROUTES 

app.get('/hire',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'role.html'));
})

app.get('/pharmacy',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'pharmacy.html'));
})


app.get('/drRobo',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'aidoctor.html'));

})

app.get('/meeting',(req,res)=>{
   res.render('meeting')

})


// Home page with feedback form
app.get('/give-feedback', (req, res) => {
 
    res.render('feedback/feedbackForm')
  });
  
  // Handle feedback submission
  app.post('/submit-feedback', async (req, res) => {
    const { name, phone, email, feedback } = req.body;

    try {
        // Save feedback to the database
        const newFeedback = new Feedback({ name, phone, email, feedback });
        await newFeedback.save();

        // Send notification email to admin
        const adminMailOptions = {
            from: process.env.GMAIL_USER,
            to: 'raisatyam710@gmail.com',
            subject: 'New Feedback Received',
            html: `
                <h2>New Feedback</h2>
                <p><b>Name:</b> ${name}</p>
                <p><b>Phone:</b> ${phone}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Feedback:</b> ${feedback}</p>
            `,
        };

        await transporter.sendMail(adminMailOptions);

        // Send thank-you email to user
        const userMailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Thank You for Your Feedback',
            text: 'Thank you for your feedback! We will review it shortly.',
        };

        await transporter.sendMail(userMailOptions);

        // Send a simple success status
        res.sendStatus(200); // Indicates success
    } catch (err) {
        console.error('Error handling feedback:', err);
        res.status(500).send('An error occurred. Please try again later.');
    }
});

  
  // Show all feedbacks
  app.get('/feedbacks', async (req, res) => {
    try {
      const feedbacks = await Feedback.find();
      res.render('feedback/feedbackShow', { feedbacks });
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      res.status(500).send('Failed to load feedbacks.');
    }
  });
  
  // Remove a feedback
  app.post('/remove-feedback', async (req, res) => {
    const { feedbackId } = req.body;
  
    try {
      await Feedback.findByIdAndDelete(feedbackId);
      res.redirect('/admin');
    } catch (err) {
      console.error('Error removing feedback:', err);
      res.status(500).send('Failed to remove feedback.');
    }
  });




// ---------------------- END P U ----------


app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'error.html'));
  });


app.use('/api/meetings', meetingRoutes);







  // Routes
  






const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
