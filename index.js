let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let cors = require('cors');


// Middlewares
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
});


// Start server
const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        let listener = app.listen(process.env.PORT || 3000, () => console.log('App listening on port ' + listener.address().port));
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
}

start();