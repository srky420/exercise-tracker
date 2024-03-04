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
        required: false,
        default: Date.now,
        get: d => d.toDateString()
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { toJSON: { getters: true, virtuals: false }, toObject: { getters: true, virtuals: false } });

module.exports = mongoose.model('Exercise', exerciseSchema);