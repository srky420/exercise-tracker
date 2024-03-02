const mongoose = require('mongoose');
const { Schema } = require('mongoose');


// Create schema
let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    log: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Exercise'
        }
    ]
});

module.exports = mongoose.model('User', userSchema);