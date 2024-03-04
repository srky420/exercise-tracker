require('dotenv').config();
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let cors = require('cors');
let UserModel = require('./models/user');
let ExerciseModel = require('./models/exercise');


// Middlewares
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Validate req body data for exercise
const validateExerciseData = (req, res, next) => {
    const { description, duration, date } = req.body;

    if (description !== '' && /^\d+$/.test(duration) && (isValidDate(date) || date === '') && date) {
        next();
    }
    else {
        res.status(400).json({
            error: 'Invalid data'
        });
    }
}

const isValidDate = (date) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (regex.test(date) && Date.parse(date)) {
        return true;
    }
    return false;
}


// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
});

// Create user route
app.post('/api/users', (req, res) => {
    // Get username from form body
    const username = req.body.username;

    // Query DB to create new user
    createNewUser(username, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error creating user' });
        }
        else {
            console.log(data);
            res.status(201).json({
                username: data.username,
                _id: data._id
            });
        }
    });
});

// Create exercise route
app.post("/api/users/:_id/exercises", (req, res) => {

    // Gather data
    const { description, date } = req.body;
    const duration = parseInt(req.body.duration);
    const userId = req.params._id;

    // Create new exercise
    createNewExercise(userId, description, duration, date, (err, doc) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error creating exercise' })
        }
        else {
            console.log(doc);
            res.status(201).json(doc);
        }
    });
});

app.get('/api/users/:_id/logs', (req, res) => {
    // Get userId from url params
    const userId = req.params._id;
    // Get query string params
    const { from, to, limit } = req.query;

    getUserLogs(userId, from, to, parseInt(limit), (err, doc) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error retrieving data' });
        }
        else {
            console.log(doc);
            res.status(200).json(doc);
        }
    })
})

app.get('/api/users', async (req, res) => {
    try {
        // Find users
        const users = await UserModel.find({});
        console.log(users);
        res.status(200).json(users);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error retrieving data' })
    }
});


// DB Queries
const createNewUser = async (username, done) => {
    // Check if user exists
    const existingUser = await UserModel.findOne({ username: username });
    if (existingUser) {
        return done(null, existingUser);
    }

    // Otherwise create new user
    const user = new UserModel({ username: username });
    user.save()
        .then(doc => done(null, doc))
        .catch(err => done(err));
}

const createNewExercise = async (userId, description, duration, date, done) => {

    try {
            // Get user
        const user = await UserModel.findById(userId);

        // Create exercise doc
        const exercise = new ExerciseModel({
            description: description,
            duration: duration,
            date: date ? new Date(date) : new Date(),
            user: user._id
        });
        const savedExercise = await exercise.save();

        done(null, {
            username: user.username,
            _id: user._id,
            description: savedExercise.description,
            duration: savedExercise.duration,
            date: new Date(savedExercise.date).toDateString()
        });
    }
    catch (e) {
        done(e);
    }
}

const getUserLogs = async (userId, from, to, limit, done) => {
    try {
        
        // Get user doc
        let user = await UserModel.findById(userId);
        if (!user) {
            return done(null, { message: 'No user found' })
        }
        
        // Create query
        let date = {};
        let query = { user: user._id };

        // Validate filters
        if (isValidDate(from)) date['$gte'] = new Date(from);
        if (isValidDate(to)) date['$lte'] = new Date(to);
        if (isValidDate(to) || isValidDate(from)) query['date'] = date;

        let exercises = await ExerciseModel.find(query).limit(+limit);

        done(null, {
            username: user.username,
            count: exercises.length,
            _id: user._id,
            log: exercises.map(ex => ({
                description: ex.description,
                duration: ex.duration,
                date: ex.date.toDateString()
            }))
        });
    }
    catch (e) {
        done(e);
    }
}

// Start server
const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connection success')
        let listener = app.listen(process.env.PORT || 3000, () => console.log('App listening on port ' + listener.address().port));
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
}

start();