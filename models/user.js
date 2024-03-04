const mongoose = require('mongoose');
const { Schema } = require('mongoose');


// Create schema
let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);