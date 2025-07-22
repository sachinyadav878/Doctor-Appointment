

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));

// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    image: String,
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


app.get('/', async (req, res) => {
    if (!req.session.user_id) return res.redirect('/login');
    try {
        const user = await User.findById(req.session.user_id).exec();
        res.render('home', { user });
    } catch (err) {
        res.send('Error');
    }
});

app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/update', (req,res)=>{
    res.render('update_profile');
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).exec();
        if (!user) return res.render('login', { message: 'Incorrect email or password!' });
        const result = await bcrypt.compare(password, user.password);
        if (result) {
            req.session.user_id = user._id;
            res.redirect('/doctor');
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
    const { name, email, password, cpassword } = req.body;
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
        const user = new User({ name, email, password: hashedPassword, image });

        await user.save(); // Use await here

        res.redirect('/doctor');
    } catch (err) {
        console.error('Error during registration:', err);
        res.render('register', { message: 'Registration failed!' });
    }
});

app.get('/update_profile', async (req, res) => {
    if (!req.session.user_id) return res.redirect('/login');
    try {
        const user = await User.findById(req.session.user_id).exec();
        res.render('update_profile', { user });
    } catch (err) {
        res.send('Error');
    }
});

app.post('/update_profile', upload.single('update_image'), async (req, res) => {
    if (!req.session.user_id) return res.redirect('/login');

    const { update_name, update_email, update_pass, new_pass, confirm_pass } = req.body;
    const update_image = req.file ? req.file.filename : null;

    try {
        const user = await User.findById(req.session.user_id).exec();
        if (update_name) user.name = update_name;
        if (update_email) user.email = update_email;
        if (update_pass && new_pass && confirm_pass) {
            const match = await bcrypt.compare(update_pass, user.password);
            if (!match) return res.render('update_profile', { message: 'Old password not matched!', user });
            if (new_pass !== confirm_pass) return res.render('update_profile', { message: 'Passwords do not match!', user });
            user.password = await bcrypt.hash(new_pass, 10);
        }
        if (update_image) user.image = update_image;

        await user.save();
        res.redirect('/');
    } catch (err) {
        console.error('Error during profile update:', err);
        res.send('Error');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// ---------------------- END P U ----------
