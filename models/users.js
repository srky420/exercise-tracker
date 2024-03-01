let mongoose = require('mongoose');


// Create schema
let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    }
})