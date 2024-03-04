const mongoose = require('mongoose');
const { Schema } = require('mongoose');


// Create model
let exerciseSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Exercise', exerciseSchema);